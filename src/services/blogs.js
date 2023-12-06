import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'
let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}
const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}
const createComment = async (data) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(
    `${baseUrl}/${data.blogId}/comments`,
    data,
    config
  )
  return response.data
}
const updateBlog = async (updatedBlogData) => {
  const config = {
    headers: { Authorization: token }
  }
  const req = axios.put(
    `${baseUrl}/${updatedBlogData.id}`,
    updatedBlogData,
    config
  )
  const res = await req
  return res.data
}

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token }
  }
  const res = await axios.delete(`${baseUrl}/${blogId}`, config)
  return res
}

export default { getAll, create, createComment, setToken, updateBlog, remove }
