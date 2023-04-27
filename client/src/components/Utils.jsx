import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
`;

export const Label = styled.label`
  font-size: 1rem;
  margin-top: 0.2rem;
`;

export const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid black;
  border-radius: 5px;
  background-color: #c5eaed;
  margin-bottom: 1rem;
  width: 100%;
  ${(props) =>
    props.backgroundColor && `background-color: ${props.backgroundColor};`}
  ::placeholder {
    font-size: 14px;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.5rem;
  font-size: 1.2rem;
  border: none;
  border-bottom: 1px solid black;
  border-radius: 5px;
  background-color: #c5eaed;
  margin-bottom: 1rem;
  width: 100%;
  resize: none;
  ::placeholder {
    font-size: 14px;
  }
`;

export const FlexCol = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  width: 100%;
`;

export const FlexRow = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  flex-direction: row;
`;
