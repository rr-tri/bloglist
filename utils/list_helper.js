/* eslint-disable no-unused-vars */
const dummy = (blogs) => {
  // ...test case function to check test configuration
  return 1
}

const totalLikes = (blogs) => {
  let total = 0
  for (let i = 0; i < blogs.length; i++) {
    total += blogs[i].likes
    // console.log(blogs[i].likes);
  }
  return total
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null // Return null if the list of blogs is empty
  }

  // Find the blog with the maximum number of likes using reduce()
  const maxLikes = blogs.reduce(
    (max, blog) => Math.max(max, blog.likes),
    -Infinity
  )

  // Filter blogs that have the maximum number of likes
  const topFavorites = blogs.filter((blog) => blog.likes === maxLikes)

  return [topFavorites[0]]
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null // Return null if the list is empty
  }

  // Create an object to store the count of blogs for each author
  const blogCounts = {}

  // Count the number of blogs for each author
  blogs.forEach((blog) => {
    if (blog.author in blogCounts) {
      blogCounts[blog.author]++
    } else {
      blogCounts[blog.author] = 1
    }
  })
  // Find the largest number of blogs written by any author
  const maxBlogs = Math.max(...Object.values(blogCounts))

  // Filter authors with the largest number of blogs
  const topAuthors = Object.keys(blogCounts).filter(
    (author) => blogCounts[author] === maxBlogs
  )

  // Return an array of objects containing top authors and their blog counts
  return topAuthors.map((author) => ({ author, blogs: blogCounts[author] }))
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null // Return null if the list is empty
  }
  const totalLikes = {}
  //calculating likes of each author
  blogs.forEach((blog) => {
    if (blog.author in totalLikes) {
      totalLikes[blog.author] += blog.likes
    } else {
      totalLikes[blog.author] = blog.likes
    }
  })
  // Find the author with the most likes using reduce()
  const topAuthor = Object.keys(totalLikes).reduce((a, b) =>
    totalLikes[a] > totalLikes[b] ? a : b
  )
  return [{ author: topAuthor, likes: totalLikes[topAuthor] }]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
