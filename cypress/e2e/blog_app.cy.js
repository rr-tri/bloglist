/* eslint-disable no-undef */

describe('Blog app', () => {
  beforeEach(function () {
    // cy.request('POST', 'http://localhost:3003/api/testing/reset')
    // const user = {
    //   username: 'Tester',
    //   password: 'password',
    //   name: 'Test User'
    // }
    // cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('/')
  })

  it('Login Form is displayed', () => {
    cy.get('[data-testid="login-button"]').click()
    cy.contains('Log in to application')
    cy.contains('User Name')
    cy.contains('Password')
    cy.contains('login')
  })
  describe('Register Component', function () {

    it('succeeds with unique credentials', function () {
      cy.get('[data-testid="login-button"]').should('exist').click()

      cy.contains('Signup')
      // Signup in the login form
      cy.contains('Signup').click()

      // Find and fill in the username and password fields
      cy.get('[name="Full name"]').type('Harry potter')
      cy.get('[name="Username"]').type('hairy')
      cy.get('[name="Password"]').type('password')
      cy.get('[name="PasswordRepeat"]').type('password')

      cy.get('form').submit()


      // Assert that the error message is displayed and is in red color
      cy.get('[data-testid="alert"]')
        .should('be.visible').contains(`User Harry potter register successful!!`)

    })
    it('fails with existing credentials', function () {
      // Find and fill in the fields with incorrect credentials
      cy.get('[data-testid="login-button"]').click()

      cy.contains('Signup')
      // Signup in the login form
      cy.contains('Signup').click()

      // Find and fill in the  fields
      cy.get('[name="Full name"]').type('Test User')
      cy.get('[name="Username"]').type('Tester')
      cy.get('[name="Password"]').type('password')
      cy.get('[name="PasswordRepeat"]').type('password')

      cy.get('form').submit()


      cy.get('[data-testid="alert"]')
        .should('be.visible').contains(' expected `username` to be unique')
    })
    it('fails with password not matching repeat password', function () {
      cy.get('[data-testid="login-button"]').click()

      // Find and fill in the fields with incorrect credentials
      cy.contains('Signup')
      // Signup in the login form
      cy.contains('Signup').click()
      // Find and fill in the  fields
      cy.get('[name="Full name"]').type('Test User 1')
      cy.get('[name="Username"]').type('Tester 1')
      cy.get('[name="Password"]').type('password')
      cy.get('[name="PasswordRepeat"]').type('assword')

      cy.get('form').submit()


      cy.get('[data-testid="alert"]')
        .should('be.visible').contains(`Both password doesn't match!!`)
    })
  })
  describe('Login Component', function () {

    it('succeeds with correct credentials', function () {

      cy.get('[data-testid="login-button"]').click()

      // Find and fill in the username and password fields
      cy.get('[name="Username"]').type('Tester')
      cy.get('[name="Password"]').type('password')

      cy.get('form').submit()

      // Assert that the user is logged in and redirected to the main page
      cy.contains('blogs')
      cy.contains('users')
      cy.contains('Tester')

      // Assert that the error message is displayed and is in red color
      cy.get('[data-testid="alert"]')
        .should('be.visible').contains(`Tester logged in successfully`)

    })

    it('fails with wrong credentials', function () {
      // Find and fill in the username and password fields with incorrect credentials
      cy.get('[data-testid="login-button"]').click()
      cy.get('[name="Username"]').type('invaliduser')
      cy.get('[name="Password"]').type('invalidpassword')

      // Submit the login form
      cy.get('form').submit()

      cy.get('[data-testid="login-button"]').should('exist')

      cy.get('[data-testid="alert"]')
        .should('be.visible').contains(`Wrong Credentials`)
    })

  })
  describe('When logged in', function () {
    beforeEach(() => {
      cy.get('[data-testid="login-button"]').click()
      // Find and fill in the username and password fields
      cy.get('[name="Username"]').type('Tester')
      cy.get('[name="Password"]').type('password')
      cy.get('form').submit()
      cy.get('[data-testid="login-username"]').should("exist").contains('Tester')

    })

    it('A blog can be created', function () {

      // Verify that the initial number of blogs is displayed
      cy.get('[data-testid="blog"]').should('have.length', 0)

      // Click the "new blog" button to open the blog creation form
      cy.contains('new blog').click()

      // Fill in the blog creation form
      cy.get('[data-testid="title-input"]').type('New Blog Title111')
      cy.get('[data-testid="author-input"]').type('New Blog Author11')
      cy.get('[data-testid="url-input"]').type('http://newblog.com')
      cy.get('[data-testid="create-button"]').click()

      cy.get('[data-testid="alert"]')
        .should('be.visible')
        .contains("Added Blog 'New Blog Title111' successfully !")

      // Verify that the new blog is added to the list of all blogs
      cy.get('[data-testid="blog"]').should('have.length', 1)

      cy.contains('New Blog Title')
      cy.contains('New Blog Author')
    })
    it('A user can like a blog', function () {
      cy.get('[data-testid="blog"]').should('have.length', 0)
      // Create a new blog
      cy.contains('new blog').click()

      cy.get('[data-testid="title-input"]').type('New Blog Title')
      cy.get('[data-testid="author-input"]').type('New Blog Author')
      cy.get('[data-testid="url-input"]').type('http://newblog.com')


      cy.get('[data-testid="create-button"]').click()

      cy.get('[data-testid="alert"]')
        .should('be.visible')
        .contains("Added Blog 'New Blog Title' successfully !")


      cy.get('[data-testid="blog"]').should('have.length', 1)


      // Select the first blog displayed and click "view"
      cy.get('[data-testid="blog"]')
        .first() // Select the first blog
        .contains('New Blog Title')
        .click()

      // Wait for the "like" button to become visible
      cy.get('[data-testid="like-button"]').should('be.visible').click()

      // Verify that the like count has increased
      cy.get('[data-testid="likes"]')
        .should('contain', '1 likes')
    })
    it('A user can delete their own blog', function () {
      cy.get('[data-testid="login-username"]').should("exist").contains('Tester')

      // Create a new blog
      cy.contains('new blog').click()
      cy.get('[data-testid="title-input"]').type('New Blog Title')
      cy.get('[data-testid="author-input"]').type('New Blog Author')
      cy.get('[data-testid="url-input"]').type('http://newblog.com')
      cy.get('[data-testid="create-button"]').click()

      // Find and click the "delete" button on the blog
      cy.get('[data-testid="blog"]')
        .first() // Select the first blog
        .contains('New Blog Title')
        .click()

      // Click the "delete" button to delete the blog
      cy.get('[data-testid="deleteButton"]').click()

      // Confirm the deletion
      cy.on('window:confirm', (str) => {
        expect(str).to.equal('Remove blog New Blog Title ?')
        return true // Confirm the deletion
      })

      // Verify that the blog has been deleted
      cy.get('[data-testid="blog"]').should('have.length', 0) // The blog list should be empty

    })
    it('Only the creator can see the delete button of their blog', function () {
      cy.get('[data-testid="login-username"]').should("exist").contains('Tester')

      cy.contains('new blog').click()
      cy.get('[data-testid="title-input"]').type('New Blog Title')
      cy.get('[data-testid="author-input"]').type('New Blog Author')
      cy.get('[data-testid="url-input"]').type('http://newblog.com')
      cy.get('[data-testid="create-button"]').click()

      cy.get('[data-testid="logoutButton"]').click()

      // Create another user
      cy.request('POST', 'http://localhost:3003/api/users', {
        username: 'anotherUser',
        password: 'anotherPassword',
      })
      cy.get('[data-testid="login-button"]').click()

      // Log in as the second user
      cy.get('[name="Username"]').type('anotherUser')
      cy.get('[name="Password"]').type('anotherPassword')
      // Submit the login form
      cy.get('form').submit()


      // Find the blog
      cy.get('[data-testid="blog"]')
        .first() // Select the first blog
        .contains('New Blog Title')
        .click()

      // Verify that the delete button is not visible for the second user
      cy.get('[data-testid="deleteButton"]').should('not.exist')

      // Logout the second user
      cy.get('[data-testid="logoutButton"]').click()
      cy.get('[data-testid="login-button"]').click()

      // Log back in as the first user
      cy.get('[name="Username"]').type('Tester')
      cy.get('[name="Password"]').type('password')
      // Submit the login form
      cy.get('form').submit()

      // Find the blog
      cy.get('[data-testid="blog"]')
        .first() // Select the first blog
        .contains('New Blog Title')
        .click()

      // Verify that the delete button is visible for the first user
      cy.get('[data-testid="deleteButton"]').should('exist')

    })

    it('Blogs are ordered by likes with the most likes first', function () {
      // Create multiple blogs with different like counts
      cy.createBlog('Blog 1', 'Author 1', 'http://blog1.com')
      cy.createBlog('Blog 2', 'Author 2', 'http://blog2.com')
      cy.createBlog('Blog 3', 'Author 3', 'http://blog3.com')
      cy.createBlog('Blog 4', 'Author 4', 'http://blog4.com')

      // Like the blogs to set different like counts
      cy.likeBlog('Blog 1', 3)
      cy.likeBlog('Blog 2', 2)
      cy.likeBlog('Blog 3')

      let result = []
      // Verify that the blogs are ordered by likes
      cy.get('[data-testid="blog"]')
        .should('have.length', 4)
        .each(($blog) => {
          result.push($blog[0].innerText.split("by")[0])
        })
        .then(() => {
          // Verify that blogs are ordered by likes (descending order)
          expect(result).to.deep.equal(['Blog 1 ', 'Blog 2 ', 'Blog 3 ', 'Blog 4 ']);

        })
    })

  })

})