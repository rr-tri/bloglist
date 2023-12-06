import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/users'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}
const getUsers = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(baseUrl, config)
  // console.log("getUsers response", response);
  return response.data
}
const createUser = async (obj) => {
  const response = await axios.post(baseUrl, obj)
  return response
}
export default { getUsers, setToken, createUser }
