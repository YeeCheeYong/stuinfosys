import React from 'react';
import { Input } from '@chakra-ui/react';
import { Form } from './Utils';
import { Button, Box } from '@chakra-ui/react';
import styled from 'styled-components';

import StripeCheckout from 'react-stripe-checkout';
// require('dotenv').config();
const stripe_key = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

const Container = styled.div`
  width: 25vw;
  display: flex;
  flex-direction: column;
  text-align: start;
  padding: 2vw;
  margin: auto;
  align-items: center;
  @media (max-width: 600px) {
    width: 90vw;
    margin-top: 0px;
  }
`;

const Title = styled.div`
  font-size: x-large;
  margin: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: center;
  margin-top: 24px;
`;

const env = process.env.REACT_APP_ENV;

const Payment = (props) => {
  const handleToken = (token) => {
    props.onCancel();
    // Handle the token returned by Stripe (this is a mock function)
    props.onSubmit();
    //alert('Payment successful!'); // You can replace this with your own logic for handling payment success
  };
  return env === 'production' ? (
    <Container>
      <Title>{props.fee}$ will be deducted</Title>
      <Form onSubmit={props.onSubmit}>
        <Input type="text" placeholder="Transaction ID" required></Input>
        <ButtonContainer>
          <Button colorScheme="red" size="sm" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button colorScheme="green" size="sm" type="submit">
            Submit
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  ) : (
    <Container>
      <Title>Class Enrolment Fee : {props.fee}$</Title>
      <Box onClick={props.onCancel}>
        <StripeCheckout
          amount={props.fee * 100}
          currency="USD" // Currency code
          token={handleToken} // Callback function to handle the token returned by Stripe
          stripeKey={stripe_key} // Your Stripe public key
        />
        <ButtonContainer>
          <Button colorScheme="red" size="sm" onClick={props.onCancel}>
            Cancel
          </Button>
        </ButtonContainer>
      </Box>
    </Container>
  );
};

export default Payment;
