import React, { useContext } from 'react';
import { Button, Box } from '@chakra-ui/react';
// import Button from '../components/Button';
import Table from '../components/Table';
import styled from 'styled-components';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const ActionContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 10px;
`;

const Container = styled.div`
  width: 60vw;
  display: flex;
  flex-flow: column;
  margin: auto;
  overflow-y: scroll;
  @media (max-width: 600px) {
    width: 90vw;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
`;

function ApproveJoinRequests(props) {
  const { user, loggedIn } = useContext(AuthContext);
  const columns = ['student', 'action'];
  const columnsArea = {
    student: '60%',
    action: '40%',
  };
  const data = [];

  const approveStudents = (studentName) => {
    const uri = `/api/v1/class/${props.classId}/${studentName}/approve`;
    axios
      .post(uri)
      .then((res) => {
        props.refetchData();
      })
      .catch((err) => console.log(err));
  };

  const declineStudents = (studentName) => {
    const uri = `/api/v1/class/${props.classId}/${studentName}/decline`;
    axios
      .post(uri)
      .then((res) => {
        props.refetchData();
      })
      .catch((err) => console.log(err));
  };

  props?.pendingStudents?.forEach((student, idx) => {
    const obj = {
      student,
      action: loggedIn &&
        user.role === 'teacher' &&
        user.username === props.classTeacher &&
        props.classActive && (
          <ActionContainer key={idx}>
            <Box>
              <Button
                colorScheme="green"
                size="sm"
                onClick={() => approveStudents(student)}
              >
                Accept
              </Button>
            </Box>
            <Box>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => declineStudents(student)}
              >
                Decline
              </Button>
            </Box>
          </ActionContainer>
        ),
    };
    data.push(obj);
  });

  return (
    <Container>
      <Table
        tableTitle={'Pending students'}
        column={columns}
        area={columnsArea}
        data={data}
        noMargin={true}
      ></Table>
      <ButtonContainer>
        <Button
          width={'30vw'}
          colorScheme="gray"
          onClick={() => props.hideModal()}
        >
          Close
        </Button>
      </ButtonContainer>
    </Container>
  );
}

export default ApproveJoinRequests;
