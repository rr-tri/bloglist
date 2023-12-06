describe('App', () => {
    describe('Login functionality', () => {
        beforeEach(() => {
            cy.visit('/login') // Visit the login page before each test
        })

        it('should display login form', () => {
            cy.get('h2').should('contain.text', 'Log in to application')
            cy.get('form').should('exist')
            cy.get('input[name="Username"]').should('exist')
            cy.get('input[name="Password"]').should('exist')
            cy.get('button[type="submit"]').should('exist')
        })

        it('should log in with valid credentials', () => {
            cy.get('input[name="Username"]').type('your_username') // Replace with your test username
            cy.get('input[name="Password"]').type('your_password') // Replace with your test password
            cy.contains('login').click()

            cy.url().should('eq', Cypress.config().baseUrl + '/') // Ensure it redirects to the homepage after login
            cy.get('button[type="submit"]').should('exist') // Check if the logout button exists indicating successful login
        })

        it('should display error message with invalid credentials', () => {
            cy.get('input[name="Username"]').type('invalid_username')
            cy.get('input[name="Password"]').type('invalid_password')
            cy.contains('login').click()
            cy.contains('Wrong Credentials').should('exist') // Check if the error message appears
        })
    })
})