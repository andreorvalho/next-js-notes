describe('Create Note', () => {
  before(() => {
    cy.task('resetTestDatabase');
  });

  beforeEach(() => {
    cy.login();
  });

  it('should create a new note when logged in', () => {
    // First verify we have a valid session
    cy.request('/api/auth/session').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('user');
    });

    cy.visit('/note/new');

    // Wait for the page to load and verify we're on the correct page
    cy.url().should('include', '/note/new');

    // Wait for the form to be visible (this handles auth redirects and loading states)
    cy.get('form', { timeout: 10000 }).should('be.visible');

    // Debug: Print all form elements to understand what's available
    cy.get('form').within(() => {
      cy.get('input').then(($inputs) => {
        console.log('Found inputs:', $inputs.length);
        $inputs.each((index, input) => {
          console.log(`Input ${index}:`, {
            name: input.name,
            type: input.type,
            id: input.id,
            placeholder: input.placeholder
          });
        });
      });

      cy.get('textarea').then(($textareas) => {
        console.log('Found textareas:', $textareas.length);
        $textareas.each((index, textarea) => {
          console.log(`Textarea ${index}:`, {
            name: textarea.name,
            id: textarea.id,
            placeholder: textarea.placeholder
          });
        });
      });

      cy.get('button').then(($buttons) => {
        console.log('Found buttons:', $buttons.length);
        $buttons.each((index, button) => {
          console.log(`Button ${index}:`, {
            type: button.type,
            text: button.textContent,
            id: button.id
          });
        });
      });
    });

    // Verify we can see the title input field
    cy.get('input[name="title"]', { timeout: 5000 }).should('be.visible');
    cy.get('input[name="title"]').type('My first note');

    cy.get('textarea[name="content"]').should('be.visible');
    cy.get('textarea[name="content"]').type('This is the content of my note.');

    // Click the submit button
    cy.get('button[type="submit"]').contains('Create Note').click();

    // Wait for the redirect to complete
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config().baseUrl}/`);

    // Verify we can see the success message or home page content
    cy.contains('Welcome').should('be.visible');
  });
});


