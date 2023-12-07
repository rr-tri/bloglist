
import Container from '@mui/material/Container'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Table from '@mui/material/Table'
import MLink from '@mui/material/Link'
import CircularProgress from '@mui/material/CircularProgress'

import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { useUser } from '../contexts/UserContext'
import userService from '../services/users'
import Typography from '@mui/material/Typography'

const Users = () => {
  const { state } = useUser()

  const getUsers = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
    retry: false,
    refetchOnWindowFocus: false,
    select: (data) => {
      return data
    },
    enabled: !!state.user
  })
  if (getUsers.isLoading) {
    return (
      <Container
        sx={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress color="success" />
      </Container>
    )
  }
  const users = getUsers.data || []
  return (
    <>
      <Typography variant='h5'>Users</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Blogs Added</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {' '}
                  <MLink
                    component={Link}
                    underline="none"
                    variant="h6"
                    to={`/users/${user.id}`}
                  >
                    {user.name}
                  </MLink>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Users
