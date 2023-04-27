import React from 'react';
import { Table, Tbody, Tr, Td, Button, Badge, Input } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useToast } from '@chakra-ui/react';
import styled from 'styled-components';
import { confirmAlert } from 'react-confirm-alert';
import { AuthContext } from '../context/authContext';
import 'react-confirm-alert/src/react-confirm-alert.css';

const TableContainer = styled.div`
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: 60vw; /* Set maximum width to 50vw */
  min-width: 400px;
  margin: auto;
  margin-bottom: 60px;
  border-radius: 10px;
  margin-top: 10vh;
  overflow-x: auto; /* Add horizontal scrollbar if table overflows */
`;

const StyledTable = styled.div`
  width: 100%;
  padding: 12px;
  overflow-x: auto; /* Add horizontal scrollbar if table overflows */
`;
const StyledLink = styled(Link)`
  text-decoration: underline;
`;
const UserList = ({ students, makeStudentTeacher }) => {
  const data = [];
  const [users, setUsers] = useState();
  const toast = useToast();
  const navigate = useNavigate();
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchValue(query);

    // Filter users based on search query and update matched count
  };

  const [searchValue, setSearchValue] = useState('');
  const { loggedIn, logoutHandler, user } = useContext(AuthContext);

  const changeRole = async (username, role) => {
    confirmAlert({
      title: 'Confirm Role Update',
      message: `Are you sure you want to update the role for user ${username} to ${role}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              // Make API call to update role in the database
              await axios.patch(`/api/v1/user/role`, { username, role });

              // Fetch updated data from the API
              const response = await axios.get('/api/v1/user');

              // Update state with fetched data
              const updatedUsers = response.data.data;
              setUsers(updatedUsers);

              // Show success toast
              toast({
                title: 'Role Updated',
                description: `Role for user ${username} updated successfully to ${role}.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            } catch (error) {
              // Show error toast
              toast({
                title: 'Error',
                description: `Failed to update role for user ${username}. Please try again later.`,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
          },
        },
        {
          label: 'No',
          onClick: () => {
            // Do nothing
          },
        },
      ],
    });
  };

  useEffect(() => {
    axios.get('/api/v1/user').then((res) => {
      const userList = res.data.data;
      setUsers(userList);
    });
  }, []);

  return !loggedIn || user.role !== 'admin' ? (
    navigate('/')
  ) : (
    <TableContainer>
      <StyledTable>
        <Input
          type="text"
          placeholder="Search by role or username"
          value={searchValue}
          onChange={handleSearchChange}
        />

        <Table variant="simple">
          <Tbody>
            {users &&
              users
                .filter(
                  (user) =>
                    user.role
                      .toLowerCase()
                      .includes(searchValue.toLowerCase()) ||
                    user.username
                      .toLowerCase()
                      .includes(searchValue.toLowerCase()) ||
                    (user.first_name + ' ' + user.last_name)
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                )
                .map((user) => (
                  <Tr key={user.username}>
                    <Td>
                      <StyledLink to={`/user/${user.username}`}>
                        {user.username}
                      </StyledLink>
                    </Td>
                    <Td>{user.first_name + ' ' + user.last_name}</Td>
                    {user.role === 'student' && (
                      <Td>
                        <Badge>Student</Badge>
                      </Td>
                    )}
                    {user.role === 'teacher' && (
                      <Td>
                        <Badge colorScheme="purple">Teacher</Badge>
                      </Td>
                    )}
                    {user.role === 'admin' && (
                      <Td>
                        <Badge colorScheme="green">Admin</Badge>
                      </Td>
                    )}

                    {user.role === 'student' && (
                      <>
                        <Td>
                          <Button
                            colorScheme="teal"
                            size="sm"
                            onClick={() => changeRole(user.username, 'admin')}
                          >
                            Make Admin
                          </Button>
                        </Td>
                        <Td>
                          <Button
                            colorScheme="purple"
                            size="sm"
                            onClick={() => changeRole(user.username, 'teacher')}
                          >
                            Make Teacher
                          </Button>
                        </Td>
                      </>
                    )}
                  </Tr>
                ))}
          </Tbody>
        </Table>
      </StyledTable>
    </TableContainer>
  );
};

export default UserList;
