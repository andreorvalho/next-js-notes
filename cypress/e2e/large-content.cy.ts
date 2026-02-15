/** Paste HTML into Quill editor via ClipboardEvent (Quill 2 does not expose __quill on DOM) */
function pasteHtmlIntoQuill(editor: HTMLElement, html: string) {
  const clipboardEvent = new ClipboardEvent('paste', {
    clipboardData: new DataTransfer(),
    bubbles: true,
  });
  clipboardEvent.clipboardData?.setData('text/html', html);
  editor.dispatchEvent(clipboardEvent);
}

describe('Large Content and Page Splitting', () => {
  const UPDATE_TIMEOUT = 15000;
  const BODY_CONTENT_TIMEOUT = 10000;

  beforeEach(() => {
    cy.mockSession();
    cy.intercept('POST', '/api/notes').as('createNote');
    cy.intercept('PUT', '/api/notes/*').as('updateNote');
    cy.intercept('GET', '/api/notes*').as('getNotes');
    cy.intercept('GET', '/api/notes/*').as('getNote');
  });

  // Generate large HTML content for testing save/load/edit flows
  // Uses 15 sections; ~42KB total, well under API body limits
  const generateLargeContent = () => {
    const sections = Array(15)
      .fill(0)
      .map(
        (_, i) =>
          `<h2>Section ${i + 1}</h2><p>This is section ${i + 1} with some content. `.repeat(30) +
          `It contains enough text to make this section substantial. `.repeat(10) +
          `</p>`
      );
    return sections.join('');
  };

  // Shared note created once for tests 2; reused to avoid duplicate create+paste+save cycles
  before(function () {
    cy.mockSession();
    cy.intercept('POST', '/api/notes').as('createNote');
    cy.intercept('PUT', '/api/notes/*').as('updateNote');
    cy.intercept('GET', '/api/notes*').as('getNotes');

    const content =
      '<p>Start marker</p>' + generateLargeContent() + '<p>End marker</p>';

    cy.visit('/');
    cy.wait('@getNotes');

    cy.contains('button', 'New', { timeout: 10000 }).click();
    cy.get('.note-title', { timeout: 5000 }).should('be.visible');
    cy.get('.note-title').first().click();
    cy.get('input.inline-edit-input', { timeout: 5000 })
      .clear()
      .type('Shared Large Note{enter}');

    cy.wait('@createNote');
    cy.get('.note-content').first().click();
    cy.get('.ql-editor', { timeout: 5000 }).scrollIntoView().should('be.visible');

    cy.get('.ql-editor').then(($editor) => {
      pasteHtmlIntoQuill($editor[0] as HTMLElement, content);
    });
    cy.get('.ql-editor').should('include.text', 'Start marker');
    cy.contains('button', 'Save').click();
    cy.wait('@updateNote', { timeout: UPDATE_TIMEOUT });
  });

  it('should save large content that exceeds page size limit', () => {
    cy.visit('/');
    cy.wait('@getNotes');

    cy.contains('button', 'New', { timeout: 10000 }).click();
    cy.get('.note-title', { timeout: 5000 }).should('be.visible');
    cy.get('.note-title').first().click();
    cy.get('input.inline-edit-input', { timeout: 5000 })
      .clear()
      .type('Large Content Note{enter}');

    cy.wait('@createNote').its('response.statusCode').should('eq', 200);

    cy.get('.note-content').first().click();
    cy.get('.ql-editor', { timeout: 5000 }).scrollIntoView().should('be.visible');

    const largeContent = generateLargeContent();
    cy.get('.ql-editor').then(($editor) => {
      pasteHtmlIntoQuill($editor[0] as HTMLElement, largeContent);
    });
    cy.get('.ql-editor').should('include.text', 'Section 1');

    cy.contains('button', 'Save').click();
    cy.wait('@updateNote', { timeout: UPDATE_TIMEOUT })
      .its('response.statusCode')
      .should('eq', 200);

    cy.contains('Note saved', { timeout: 10000 }).should('be.visible');

    cy.get('[data-page-number]').should('not.exist');
    cy.get('.page-navigation').should('not.exist');
    cy.get('.page-indicator').should('not.exist');
  });

  it('should load large content as single document and allow editing seamlessly', () => {
    cy.visit('/');
    cy.wait('@getNotes');

    cy.contains('Shared Large Note', { timeout: 5000 }).click();
    cy.wait('@getNote');

    cy.get('.note-content', { timeout: 15000 }).should('be.visible');
    cy.get('body', { timeout: BODY_CONTENT_TIMEOUT }).should(
      'include.text',
      'Start marker'
    );
    cy.get('body').should('include.text', 'End marker');

    cy.get('.note-content').first().scrollIntoView().click({ force: true });
    cy.get('.ql-editor', { timeout: 5000 }).scrollIntoView().should('be.visible');

    cy.get('.ql-editor').scrollIntoView().type('{moveToEnd}', { force: true });
    cy.get('.ql-editor')
      .scrollIntoView()
      .type('{enter}Additional content added', { force: true });

    cy.contains('button', 'Save').click();
    cy.wait('@updateNote', { timeout: UPDATE_TIMEOUT });

    cy.contains('Note saved', { timeout: 10000 }).should('be.visible');
  });
});
