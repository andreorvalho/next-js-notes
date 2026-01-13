describe('Rich Text Editor', () => {
  before(() => {
    cy.task('resetTestDatabase');
  });

  beforeEach(() => {
    cy.mockSession();
  });

  it('should create a note with rich text content', () => {
    cy.intercept('POST', '/api/notes').as('createNote');
    cy.intercept('GET', '/api/notes*').as('getNotes');

    cy.visit('/');
    cy.wait('@getNotes');

    // Click New button
    cy.contains('button', 'New', { timeout: 10000 }).click();

    // Wait for form
    cy.get('.note-title', { timeout: 5000 }).should('be.visible');

    // Enter title
    cy.get('.note-title').click();
    cy.get('input.inline-edit-input', { timeout: 5000 })
      .should('be.visible')
      .clear()
      .type('Rich Text Note{enter}');

    cy.wait('@createNote').its('response.statusCode').should('eq', 200);

    // Click content area to edit
    cy.get('.note-content').click();

    // Wait for rich text editor to appear
    cy.get('.ql-editor', { timeout: 5000 }).should('be.visible');

    // Type content in rich text editor
    cy.get('.ql-editor').type('This is {selectall}rich text content');

    // Apply bold formatting
    cy.get('.ql-bold').click();
    cy.get('.ql-editor').should('contain.html', '<strong>');

    // Save
    cy.contains('button', 'Save').click();

    // Verify note appears in list
    cy.contains('Rich Text Note', { timeout: 5000 }).should('be.visible');
  });

  it('should paste formatted HTML content', () => {
    cy.intercept('POST', '/api/notes').as('createNote');
    cy.intercept('PUT', '/api/notes/*').as('updateNote');
    cy.intercept('GET', '/api/notes*').as('getNotes');

    cy.visit('/');
    cy.wait('@getNotes');

    cy.contains('button', 'New', { timeout: 10000 }).click();
    cy.get('.note-title', { timeout: 5000 }).should('be.visible');

    // Enter title
    cy.get('.note-title').click();
    cy.get('input.inline-edit-input', { timeout: 5000 })
      .clear()
      .type('Paste Test Note{enter}');

    cy.wait('@createNote');

    // Click content area
    cy.get('.note-content').click();

    // Wait for rich text editor
    cy.get('.ql-editor', { timeout: 5000 }).should('be.visible');

    // Paste HTML content
    const htmlContent = '<p>This is <strong>formatted</strong> content from Evernote</p>';
    cy.get('.ql-editor').then(($editor) => {
      const editor = $editor[0] as any;
      const clipboardEvent = new ClipboardEvent('paste', {
        clipboardData: new DataTransfer(),
      });
      clipboardEvent.clipboardData?.setData('text/html', htmlContent);
      editor.dispatchEvent(clipboardEvent);
    });

    // Verify content is pasted
    cy.get('.ql-editor').should('contain.html', 'formatted');

    // Save
    cy.contains('button', 'Save').click();
    cy.wait('@updateNote', { timeout: 10000 })
      .its('response.statusCode')
      .should('eq', 200);
  });

  it('should apply formatting (bold, italic, lists)', () => {
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
      .type('Formatting Test{enter}');

    cy.wait('@createNote');

    cy.get('.note-content').click();
    cy.get('.ql-editor', { timeout: 5000 }).should('be.visible');

    // Type content
    cy.get('.ql-editor').type('Test content');

    // Select text and apply bold
    cy.get('.ql-editor').type('{selectall}');
    cy.get('.ql-bold').click();
    cy.get('.ql-editor').should('contain.html', '<strong>');

    // Apply italic
    cy.get('.ql-editor').type('{selectall}');
    cy.get('.ql-italic').click();
    cy.get('.ql-editor').should('contain.html', '<em>');

    // Create list
    cy.get('.ql-editor').clear().type('Item 1{enter}Item 2{enter}Item 3');
    cy.get('.ql-list[value="ordered"]').click();
    cy.get('.ql-editor').should('contain.html', '<ol>');

    cy.contains('button', 'Save').click();
    cy.wait('@updateNote', { timeout: 10000 });
  });

  it('should render HTML content in display mode', () => {
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
      .type('Display Test{enter}');

    cy.wait('@createNote');

    cy.get('.note-content').click();
    cy.get('.ql-editor', { timeout: 5000 }).should('be.visible');

    // Add formatted content
    cy.get('.ql-editor').type('Heading{selectall}');
    cy.get('.ql-header[value="1"]').click();
    cy.get('.ql-editor').type('{enter}This is a paragraph with {selectall}bold text');
    cy.get('.ql-bold').click();

    cy.contains('button', 'Save').click();
    cy.wait('@updateNote', { timeout: 10000 });

    // Click outside to exit edit mode
    cy.get('body').click(0, 0);

    // Verify HTML is rendered
    cy.get('.rich-text-display').should('be.visible');
    cy.get('.rich-text-display').should('contain.html', '<h1>');
    cy.get('.rich-text-display').should('contain.html', '<strong>');
  });
});
