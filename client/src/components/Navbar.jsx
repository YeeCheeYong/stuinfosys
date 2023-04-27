import { Box, Button, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
// import AdminDrawer from './adminDrawer';
import { useNavigate } from 'react-router-dom';

const MyNavbar = (props) => {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);
  const navigate = useNavigate();

  const { loggedIn, logoutHandler, user } = useContext(AuthContext);

  const MenuItems = (props) => (
    <Link
      as={RouterLink}
      mt={{ base: 1, md: 0 }}
      mb={{ base: 1, md: 0 }}
      mr={6}
      ml={3}
      display="block"
      to={props.to}
      style={{ color: '#FFF', textDecoration: 'none' }}
    >
      {props.children}
    </Link>
  );

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="0.8rem"
      bg="gray.800"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="md" letterSpacing="-.06rem">
          <MenuItems to="/">Student Information System</MenuItems>
        </Heading>
      </Flex>

      <Box display={{ base: 'block', md: 'none' }} onClick={handleToggle}>
        <svg
          fill="white"
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      <Box
        display={{ base: show ? 'block' : 'none', md: 'flex' }}
        width={{ base: 'full', md: 'auto' }}
        alignItems="center"
        flexGrow={1}
      >
        {loggedIn && (
          <>
            {user.role === 'admin' && (
              <>
                <MenuItems to="/user">Users</MenuItems>
                <MenuItems to="/approve-transcript">Transcripts</MenuItems>
              </>
            )}
            {(user.role === 'student' || user.role === 'teacher') && (
              <MenuItems to="/my-classes">My Classes</MenuItems>
            )}

            {user && (
              <Button
                boxShadow="none !important"
                colorScheme="white"
                ml="auto"
                mr="0"
              >
                <Text
                  onClick={() => navigate(`/user/${user.username}`)}
                  fontSize="17px"
                  color="white"
                >
                  {user.username}
                </Text>
              </Button>
            )}
          </>
        )}
      </Box>

      <Box
        display={{ base: show ? 'block' : 'none', md: 'block' }}
        mt={{ base: 4, md: 0 }}
        ml={2}
      >
        {!loggedIn && (
          <Button as={RouterLink} to="/signin" bg="transparent" border="1px">
            Sign In
          </Button>
        )}
        {loggedIn && (
          <Button onClick={logoutHandler} bg="transparent" border="1px">
            Log Out
          </Button>
        )}
      </Box>
    </Flex>
  );
};

export default MyNavbar;
