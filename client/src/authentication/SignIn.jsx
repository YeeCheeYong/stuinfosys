import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import Layout from '../components/Layout';
import { AuthContext } from '../context/authContext';

const signInSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .min(5, 'username must be min 5 chars.')
    .matches(/^\S+$/, "Username can't contain white space"),

  password: yup
    .string()
    .required('No password provided.')
    .min(8, 'Password should be min 8 chars.'),
});

const SignIn = (props) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const color = useColorModeValue('gray.100', 'gray.600');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(signInSchema),
    mode: 'onChange',
  });
  const [requestState, setRequestState] = useState('not-requested');
  const [message, setMessage] = useState(null);
  const toast = useToast();
  const { loggedIn, login } = useContext(AuthContext);
  const URL = process.env.REACT_APP_URL;
  const handleClick = () => setShow(!show);

  const signIn = (data, e) => {
    e.preventDefault();
    setRequestState('loading');
    const { username, password } = data;
    axios
      .post(`/api/v1/user/signin`, { username, password })
      .then((res) => {
        setRequestState('loaded');
        login(res.data.user);
        toast({
          title: 'Logged In successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        setRequestState('error');
        if (err.response.status == 500) setMessage('Something went wrong!');
        else setMessage(err.response.data.message);
      });
  };

  if (loggedIn) return navigate('/');
  return (
    <Layout>
      <Center h={['75vh', '85vh']}>
        <Box
          boxShadow="dark-lg"
          textAlign="center"
          bg={color}
          borderRadius={5}
          p={10}
        >
          <Heading size="md" m={1}>
            Log In
          </Heading>
          <form onSubmit={handleSubmit(signIn)} noValidate>
            <InputGroup m={1}>
              <Input
                type="text"
                placeholder="Username"
                name="username"
                required
                {...register('username')}
              />
            </InputGroup>
            <p>
              <Text color="red">{errors.username?.message}</Text>
            </p>
            <InputGroup m={1}>
              <Input
                type={show ? 'text' : 'password'}
                placeholder="Password"
                name="password"
                show={show}
                required
                {...register('password')}
              />
              <InputRightElement width="4.5rem">
                <Button
                  color="black"
                  boxShadow="none !important"
                  h="1.75rem"
                  size="sm"
                  onClick={handleClick}
                >
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>

            <p>
              <Text color="red">{errors.password?.message}</Text>
            </p>
            <Text display="block" fontSize="md" color="red">
              {message}
            </Text>
            <Button
              colorScheme="teal"
              size="sm"
              m={1}
              mb={4}
              disabled={requestState === 'loading' ? 1 : 0}
              type="submit"
            >
              {requestState === 'loading' && <Spinner mr={3} />}Sign In
            </Button>
          </form>
          <Text fontSize="sm">
            <Link color="teal.500" href="/signup" m={1}>
              Don't have an account?
            </Link>
          </Text>
        </Box>
      </Center>
    </Layout>
  );
};

export default SignIn;
