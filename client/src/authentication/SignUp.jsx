import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
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

const signUpSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required!')
    .min(5, 'username must be min 5 chars.')
    .matches(/^\S+$/, "Username can't contain white space"),
  password: yup
    .string()
    .required('Password is required!')
    .min(8, 'Password should be min 8 chars.'),
  confirmPassword: yup
    .string()
    .required('Password confirmation is required!')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  firstName: yup.string().trim().required('First Name is required!'),
  lastName: yup.string().trim().required('Last Name is required!'),
  email: yup
    .string()
    .email('Must be a valid email')
    .max(255)
    .required('Email is required!'),
});

const SignUp = (props) => {
  const color = useColorModeValue('gray.100', 'gray.600');
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { loggedIn, login } = useContext(AuthContext);
  const [requestState, setRequestState] = useState('not-requested');
  const [message, setMessage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange',
  });
  const toast = useToast();
  const handleClick = () => setShow(!show);
  const signUp = (data, e) => {
    e.preventDefault();
    const { email, username, firstName, lastName, password } = data;
    setRequestState('loading');
    axios
      .post(`/api/v1/user/signup`, {
        email,
        username,
        first_name: firstName,
        last_name: lastName,
        password,
      })
      .then((res) => {
        setRequestState('loaded');
        toast({
          title: 'Your Account is created! Please login to continue',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/signin');
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
          zIndex={30}
          boxShadow="dark-lg"
          textAlign="center"
          bg={color}
          borderRadius={5}
          p={10}
        >
          <Heading size="md" m={3}>
            Create Your Account
          </Heading>
          <form onSubmit={handleSubmit(signUp)} noValidate>
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
                placeholder="Email"
                type="email"
                m={1}
                name="email"
                required
                autoFocus
                {...register('email')}
              />
            </InputGroup>
            <p>
              <Text color="red">{errors.email?.message}</Text>
            </p>

            <InputGroup m={1}>
              <Input
                type="text"
                placeholder="First Name"
                name="firstName"
                required
                {...register('firstName')}
              />
            </InputGroup>
            <p>
              <Text color="red">{errors.firstName?.message}</Text>
            </p>

            <InputGroup m={1}>
              <Input
                type="text"
                placeholder="Last Name"
                name="lastName"
                required
                {...register('lastName')}
              />
            </InputGroup>
            <p>
              <Text color="red">{errors.lastName?.message}</Text>
            </p>

            <InputGroup m={1}>
              <Input
                type={show ? 'text' : 'password'}
                placeholder="Password"
                name="password"
                required
                {...register('password')}
              />
              <InputRightElement width="4.5rem">
                <Button
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
            <InputGroup m={1}>
              <Input
                type={show ? 'text' : 'password'}
                placeholder="Confirm Password"
                name="confirmPassword"
                required
                {...register('confirmPassword')}
              />
            </InputGroup>
            <p>
              <Text color="red">{errors.confirmPassword?.message}</Text>
            </p>

            {requestState === 'error' && (
              <Text display="block" fontSize="md" color="tomato">
                {message}
              </Text>
            )}
            <Button
              colorScheme="teal"
              size="sm"
              m={1}
              mb={4}
              disabled={requestState === 'loading' ? 1 : 0}
              type="submit"
            >
              {requestState === 'loading' && <Spinner mr={3} />}Sign Up
            </Button>
          </form>
        </Box>
      </Center>
    </Layout>
  );
};

export default SignUp;
