import React from 'react';
import styled from 'styled-components';

const ButtonPrimary = styled.button`
  background-color: #bbbaba;
  :hover {
    background-color: #d4d2d2;
  }
  cursor: pointer;
  color: black;
  border: none;
  border-radius: 5px;
  padding: 12px;
  text-decoration: none;
  width: ${(props) => (props.width ? props.width : 'auto')};
`;

const ButtonDanger = styled(ButtonPrimary)`
  background-color: #ed5555;
  :hover {
    background-color: #ed8e8e;
  }
  color: white;
`;

const ButtonSuccess = styled(ButtonPrimary)`
  background-color: #39ed9c;
  :hover {
    background-color: #8eedc3;
  }
`;

const ButtonSecondary = styled(ButtonPrimary)`
  background-color: #36aaed;
  :hover {
    background-color: #83c8f0;
  }
  color: white;
`;

const SmallButton = styled(ButtonPrimary)`
  height: 30px;
  background-color: #55eda9;
  padding: 0;
  padding-left: 6px;
  padding-right: 6px;
  align-items: center;
  margin: auto;
  :disabled {
    background-color: #a4f5d0;
    cursor: not-allowed;
  }
`;

function Button(props) {
  if (props.version === 'primary')
    return (
      <ButtonPrimary
        disabled={props.disabled ? true : false}
        onClick={props.onClick}
        width={props.width}
      >
        {props.children}
      </ButtonPrimary>
    );
  else if (props.version === 'danger')
    return (
      <ButtonDanger
        disabled={props.disabled ? true : false}
        onClick={props.onClick}
        width={props.width}
      >
        {props.children}
      </ButtonDanger>
    );
  else if (props.version === 'success')
    return (
      <ButtonSuccess
        id="success"
        disabled={props.disabled ? true : false}
        onClick={props.onClick}
        width={props.width}
      >
        {props.children}
      </ButtonSuccess>
    );
  else if (props.version === 'secondary')
    return (
      <ButtonSecondary
        disabled={props.disabled ? true : false}
        onClick={props.onClick}
        width={props.width}
      >
        {props.children}
      </ButtonSecondary>
    );
  else if (props.version === 'small')
    return (
      <SmallButton
        id="small"
        disabled={props.disabled ? true : false}
        onClick={props.onClick}
      >
        {props.children}
      </SmallButton>
    );
  else
    return (
      <ButtonPrimary
        disabled={props.disabled ? true : false}
        onClick={props.onClick}
      >
        {props.children}
      </ButtonPrimary>
    );
}

export default Button;
