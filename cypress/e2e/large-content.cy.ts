describe('Large Content and Page Splitting', () => {
  before(() => {
    cy.task('resetTestDatabase');
  });

  beforeEach(() => {
    cy.mockSession();
  });

  // Generate large HTML content (exceeds 1MB page size limit)
  const generateLargeContent = () => {
    const sections = Array(100)
      .fill(0)
      .map(
        (_, i) =>
          `<h2>Section ${i + 1}</h2><p>This is section ${i + 1} with some content. `.repeat(50) +
          `It contains enough text to make this section substantial. `.repeat(20) +
          `</p>`
      );
    return sections.join('');
  };

  it('should save large content that exceeds page size limit', () => {
    cy.intercept('POST', '/api/notes').as('createNote');
    cy.intercept('PUT', '/api/notes/*').as('updateNote');
    cy.intercept('GET', '/api/notes*').as('getNotes');

    cy.visit('/');
    cy.wait('@getNotes');

    cy.contains('button', 'New', { timeout: 10000 }).click();
    cy.get('.note-title', { timeout: 5000 }).should('be.visible');

    cy.get('.note-title').click();
    cy.get('input.inline-edit-input', { timeout: 5000 })
      .clear()
      .type('Large Content Note{enter}');

    cy.wait('@createNote').its('response.statusCode').should('eq', 200);

    cy.get('.note-content').click();
    cy.get('.ql-editor', { timeout: 5000 }).should('be.visible');

    // Paste large content
    const largeContent = generateLargeContent();
    cy.get('.ql-editor').then(($editor) => {
      const editor = $editor[0] as any;
      // Set content directly via Quill API
      if (editor.__quill) {
        editor.__quill.clipboard.dangerouslyPasteHTML(largeContent);
      }
    });

    // Wait a bit for content to be set
    cy.wait(500);

    // Save
    cy.contains('button', 'Save').click();

    // Verify save succeeds
    cy.wait('@updateNote', { timeout: 30000 })
      .its('response.statusCode')
      .should('eq', 200);

    // Verify success message
    cy.contains('Note saved', { timeout: 10000 }).should('be.visible');
  });

  it('should load large content as single document (pages merged)', () => {
    cy.intercept('POST', '/api/notes').as('createNote');
    cy.intercept('PUT', '/api/notes/*').as('updateNote');
    cy.intercept('GET', '/api/notes*').as('getNotes');
    cy.intercept('GET', '/api/notes/*').as('getNote');

    cy.visit('/');
    cy.wait('@getNotes');

    cy.contains('button', 'New', { timeout: 10000 }).click();
    cy.get('.note-title', { timeout: 5000 }).should('be.visible');

    cy.get('.note-title').click();
    cy.get('input.inline-edit-input', { timeout: 5000 })
      .clear()
      .type('Large Content Test{enter}');

    cy.wait('@createNote');

    cy.get('.note-content').click();
    cy.get('.ql-editor', { timeout: 5000 }).should('be.visible');

    // Add content with markers to verify it's all there
    const content = '<p>Start marker</p>' + generateLargeContent() + '<p>End marker</p>';
    cy.get('.ql-editor').then(($editor) => {
      const editor = $editor[0] as any;
      if (editor.__quill) {
        editor.__quill.clipboard.dangerouslyPasteHTML(content);
      }
    });

    cy.wait(500);
    cy.contains('button', 'Save').click();
    cy.wait('@updateNote', { timeout: 30000 });

    // Reload page
    cy.reload();
    cy.wait('@getNotes');

    // Click on the note
    cy.contains('Large Content Test', { timeout: 5000 }).click();
    cy.wait('@getNote');

    // Verify content loads as single document
    cy.get('.note-content', { timeout: 5000 }).should('be.visible');

    // Verify markers are present (content is merged)
    cy.get('.rich-text-display').should('contain', 'Start marker');
    cy.get('.rich-text-display').should('contain', 'End marker');
  });

  it('should allow editing large notes seamlessly', () => {
    cy.intercept('POST', '/api/notes').as('createNote');
    cy.intercept('PUT', '/api/notes/*').as('updateNote');
    cy.intercept('GET', '/api/notes*').as('getNotes');
    cy.intercept('GET', '/api/notes/*').as('getNote');

    cy.visit('/');
    cy.wait('@getNotes');

    cy.contains('button', 'New', { timeout: 10000 }).click();
    cy.get('.note-title', { timeout: 5000 }).should('be.visible');

    cy.get('.note-title').click();
    cy.get('input.inline-edit-input', { timeout: 5000 })
      .clear()
      .type('Editable Large Note{enter}');

    cy.wait('@createNote');

    cy.get('.note-content').click();
    cy.get('.ql-editor', { timeout: 5000 }).should('be.visible');

    // Add initial content
    const initialContent = '<p>Initial content</p>' + generateLargeContent();
    cy.get('.ql-editor').then(($editor) => {
      const editor = $editor[0] as any;
      if (editor.__quill) {
        editor.__quill.clipboard.dangerouslyPasteHTML(initialContent);
      }
    });

    cy.wait(500);
    cy.contains('button', 'Save').click();
    cy.wait('@updateNote', { timeout: 30000 });

    // Reload and edit
    cy.reload();
    cy.wait('@getNotes');
    cy.contains('Editable Large Note', { timeout: 5000 }).click();
    cy.wait('@getNote');

    // Click to edit
    cy.get('.note-content').click();
    cy.get('.ql-editor', { timeout: 5000 }).should('be.visible');

    // Add more content
    cy.get('.ql-editor').type('{moveToEnd}');
    cy.get('.ql-editor').type('{enter}Additional content added');

    cy.contains('button', 'Save').click();
    cy.wait('@updateNote', { timeout: 30000 });

    // Verify edit succeeded
    cy.contains('Note saved', { timeout: 10000 }).should('be.visible');
  });

  it('should not show any UI indication of pages existing', () => {
    cy.intercept('POST', '/api/notes').as('createNote');
    cy.intercept('PUT', '/api/notes/*').as('updateNote');
    cy.intercept('GET', '/api/notes*').as('getNotes');

    cy.visit('/');
    cy.wait('@getNotes');

    cy.contains('button', 'New', { timeout: 10000 }).click();
    cy.get('.note-title', { timeout: 5000 }).should('be.visible');

    cy.get('.note-title').click();
    cy.get('input.inline-edit-input', { timeout: 5000 })
      .clear()
      .type('No Pages UI Test{enter}');

    cy.wait('@createNote');

    cy.get('.note-content').click();
    cy.get('.ql-editor', { timeout: 5000 }).should('be.visible');

    // Add large content
    const largeContent = generateLargeContent();
    cy.get('.ql-editor').then(($editor) => {
      const editor = $editor[0] as any;
      if (editor.__quill) {
        editor.__quill.clipboard.dangerouslyPasteHTML(largeContent);
      }
    });

    cy.wait(500);
    cy.contains('button', 'Save').click();
    cy.wait('@updateNote', { timeout: 30000 });

    // Verify no page-related UI elements exist
    cy.get('body').should('not.contain', 'page');
    cy.get('body').should('not.contain', 'Page');
    cy.get('body').should('not.contain', 'PAGE');
    cy.get('[data-page-number]').should('not.exist');
    cy.get('.page-navigation').should('not.exist');
    cy.get('.page-indicator').should('not.exist');
  });
});
