/* eslint-disable no-console */
/* eslint-disable indent */
describe('Bloglist App', () => {
    beforeEach(() => {
        cy.visit('/')
    })
    describe('Login page', () => {
        it('should display login form properly', () => {
            cy.get('[data-testid="login-button"]').should('exist').click()
            cy.get('h2').should('contain.text', 'Log in to application')
            cy.get('form').should('exist')
            cy.get('input[name="Username"]').should('exist')
            cy.get('input[name="Password"]').should('exist')
            cy.get('button[type="submit"]').should('exist')
            cy.contains('Signup')

        })

        it('should log in with valid credentials', () => {
            cy.Login('tester', 'password')
            cy.url().should('eq', Cypress.config().baseUrl + '/') // Ensure it redirects to the homepage after login
            cy.get('button[data-testid="logoutButton"]').should('exist') // Check if the logout button exists indicating successful login
            cy.get('[data-testid="login-username"]').should('exist').contains('tester')
            cy.get('[data-testid="alert"]').should('be.visible').contains('tester logged in successfully')
        })

        it('should display error message with invalid credentials', () => {
            cy.Login('invalid_username', 'invalid_username')

            cy.url().should('eq', Cypress.config().baseUrl + '/login')

            cy.get('[data-testid="alert"]').should('be.visible').contains('invalid username or password')
        })
    })
    describe('Register page', () => {
        it('succeeds with unique credentials', function () {
            cy.request('POST', 'http://localhost:3003/api/users/delete/testuser')

            cy.Register('Tester Name', 'Tester', 'password', 'password')
            cy.get('[data-testid="alert"]')
                .should('be.visible').contains('User Tester Name register successful!!')

        })
        it('fails with existing credentials', function () {
            cy.Register('Harry Potter', 'hairy', 'password', 'password')
            cy.get('[data-testid="alert"]')
                .should('be.visible').contains('Username "hairy" already exists.')
        })
        it('fails with password not matching repeat password', function () {
            cy.Register('Tester\'s Name', 'Tester', 'pass', 'word')

            cy.get('[data-testid="alert"]')
                .should('be.visible').contains('Both password doesn\'t match!!')
        })
    })
    describe('blogs page without login', () => {

        it('Displays bloglist without login by default', function () {
            cy.get('[data-testid="login-button"]').should('exist')
            cy.contains('blogs')
            // Signup in the login form
            cy.contains('users')
            cy.contains('new blog')
            cy.get('[data-testid="blog"]').should('have.length', 7)
            console.log(cy.get('[data-testid="blog"]'))
        })
        it('clicking on new blog button without login gives alert ', function () {
            cy.get('[data-testid="login-button"]').should('exist')

            cy.contains('new blog').click()

            // Assert that the error message is displayed without login
            cy.get('[data-testid="alert"]')
                .should('be.visible').contains('Please login first to add blog')

        })
        it('clicking on users navigation without login takes to login page ', function () {
            cy.get('[data-testid="login-button"]').should('exist')
            cy.contains('users').click()

            cy.url().should('eq', 'http://localhost:3003/login')
            cy.contains('Log in to application')
        })

    })
    describe('blog page with login', () => {

        it('A blog can be created after login', function () {
            cy.request('POST', 'http://localhost:3003/api/blogs/delete/testblog')
            cy.Login('Tester', 'password')
            cy.get('[data-testid="login-username"]').should('exist').contains('Tester')
            cy.createBlog('New Test Blog Title', 'Author 1', 'http://blog1.com')
            cy.get('[data-testid="alert"]')
                .should('be.visible')
                .contains('Added Blog \'New Test Blog Title\' successfully !')

            cy.get('nav[aria-label="pagination navigation"] ul') // Find the ul element inside the nav with aria-label
                .find('li') // Find all li elements
                .eq(-2) // Select the n-1 li element
                .click() // Click on it
            cy.get('[data-testid="blog"]')

            cy.get('[data-testid="blog"]')
                .should('contain.text', 'New Test Blog Title')
                .should('contain.text', 'Author 1')
        })
        it('Logged in user can like a blog', function () {
            cy.Login('Tester', 'password')
            cy.get('[data-testid="login-username"]').should('exist').contains('Tester')
            cy.get('nav[aria-label="pagination navigation"] ul') // Find the ul element inside the nav with aria-label
                .find('li') // Find all li elements
                .eq(-2) // Select the n-1 li element
                .click() // Click on it
            cy.get('[data-testid="blog"]')
                .contains('New Test Blog Title').click() // Check that this element contains the text
            cy.contains('New Test Blog Title')
            // Wait for the "like" button to become visible
            cy.get('[data-testid="like-button"]').should('be.visible').click()

            // Verify that the like count has increased
            cy.get('[data-testid="likes"]')
                .should('contain', '1 likes')
        })
        it('A user can delete their own blog', function () {
            cy.Login('Tester', 'password')
            cy.get('[data-testid="login-username"]').should('exist').contains('Tester')
            // Click the "new blog" button to open the blog creation form
            cy.createBlog('New Blog Title', 'New Test Blog Author', 'http://newblog.com')


            cy.get('[data-testid="alert"]')
                .should('be.visible')
                .contains('Added Blog \'New Blog Title\' successfully !')

            cy.get('nav[aria-label="pagination navigation"] ul') // Find the ul element inside the nav with aria-label
                .find('li') // Find all li elements
                .eq(-2) // Select the n-1 li element
                .click() // Click on it
            cy.get('[data-testid="blog"]')
                .contains('New Blog Title').click() // Check that this element contains the text
            cy.contains('New Blog Title')
            // Click the "delete" button to delete the blog
            cy.get('[data-testid="deleteButton"]').click()

            // Confirm the deletion
            cy.on('window:confirm', (str) => {
                expect(str).to.equal('Remove blog New Blog Title ?')
                return true // Confirm the deletion
            })

            cy.get('nav[aria-label="pagination navigation"] ul') // Find the ul element inside the nav with aria-label
                .find('li') // Find all li elements
                .eq(-2) // Select the n-1 li element
                .click() // Click on it
            cy.get('[data-testid="blog"]')
                .should('not.contain', 'New Test Blog Title')



            it('clicking on users navigation with login takes to Users page ', function () {

                cy.get('[data-testid="logoutButton"]').should('exist').should('be.visible')
                cy.contains('users').click()

                cy.url().should('eq', 'http://localhost:3003/users')
                cy.contains('Blogs Added')
                cy.contains('Name')
                cy.contains('Harry potter')


            })

        })
    })
    describe('users page', () => {
        beforeEach(() => {
            cy.Login('hairy', 'password')
            cy.get('[data-testid="login-username"]').should('exist').contains('hairy')
            cy.get('[data-testid="logoutButton"]').should('exist').should('be.visible')


        })
        it('A user cannot delete others blog', function () {

            cy.get('nav[aria-label="pagination navigation"] ul') // Find the ul element inside the nav with aria-label
                .find('li') // Find all li elements
                .eq(-2) // Select the n-1 li element
                .click() // Click on it
            cy.get('[data-testid="blog"]')
                .contains('The Differences Between a Junior, Mid-Level, and Senior Developer').click() // Check that this element contains the text
            cy.contains('The Differences Between a Junior, Mid-Level, and Senior Developer')
            // Click the "delete" button to delete the blog
            cy.get('[data-testid="deleteButton"]').should('not.exist')


        })
        it('if logged in: clicking on the name of user we can see user page and list of blogs added by that user', function () {
            cy.contains('users').click()
            cy.url().should('eq', 'http://localhost:3003/users')
            cy.contains('Santosh K C').click()
            cy.contains('Total Blogs :16')
            cy.contains('Added Blog List')
            cy.get('[data-testid="addedBlog"]').should('exist').contains('What They Thought of Programmers.')

        })
    })
})