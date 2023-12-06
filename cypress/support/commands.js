/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// eslint-disable-next-line no-undef
Cypress.Commands.add('createBlog', (title, author, url) => {
  cy.contains('new blog').click()
  cy.get('[data-testid="title-input"]').type(title)
  cy.get('[data-testid="author-input"]').type(author)
  cy.get('[data-testid="url-input"]').type(url)

  cy.get('[data-testid="create-button"]').click()
  // cy.contains('Cancel').click()
}, 1000)
Cypress.Commands.add('likeBlog', (blogTitle, num) => {
  cy.get('[data-testid="blog"]')
    .contains(blogTitle)
    .click()
  cy.get('[data-testid="like-button"]').should('be.visible')
  for (let index = 0; index < num; index++) {
    cy.get('[data-testid="like-button"]').click()
    cy.get('[data-testid="likes"]').should('contain', index + 1, ' likes')
  }
  cy.get('[data-testid="nav-blogs"]').click()
})
