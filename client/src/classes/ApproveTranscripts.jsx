import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { Button } from '@chakra-ui/react';
// import Button from '../components/Button';
import Table from '../components/Table';
import styled from 'styled-components';
import axios from 'axios';

const ActionContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 24px;
`;

const Container = styled.div`
  width: 70%;
  display: flex;
  flex-flow: column;
  margin: auto;
  margin-top: 50px;
  overflow-y: scroll;
  @media (max-width: 600px) {
    width: 90vw;
  }
`;
const StyledLink = styled(Link)`
  text-decoration: underline;
`;
function ApproveTranscript(props) {
  const columns = ['student', 'action'];
  const columnsArea = {
    student: '60%',
    action: '40%',
  };
  const navigate = useNavigate();
  const { loggedIn, logoutHandler, user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const data = [];

  const approveTranscript = async (studentName) => {
    const uri = `/api/v1/user/${studentName}/transcript/approve`;
    await axios
      .patch(uri)
      .then((res) => {
        fetchStudentsAppliedForTranscript();
      })
      .catch((err) => console.log(err));
  };

  const declineTranscript = async (studentName) => {
    const uri = `/api/v1/user/${studentName}/transcript/decline`;
    await axios
      .patch(uri)
      .then((res) => {
        fetchStudentsAppliedForTranscript();
      })
      .catch((err) => console.log(err));
  };

  const fetchStudentsAppliedForTranscript = async () => {
    const uri = '/api/v1/user/transcript/all'; // Complete the uri
    axios.get(uri).then((res) => {
      setStudents(res.data.data);
    });
  };

  students?.forEach((student, idx) => {
    const obj = {
      student: (
        <StyledLink to={`/user/${student.username}`}>
          {student.first_name + ' ' + student.last_name}
        </StyledLink>
      ),
      action: (
        <ActionContainer key={idx}>
          <Button
            colorScheme="green"
            size="sm"
            onClick={() => approveTranscript(student.username)}
          >
            Accept
          </Button>
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => declineTranscript(student.username)}
          >
            Decline
          </Button>
        </ActionContainer>
      ),
    };
    data.push(obj);
  });

  useEffect(() => {
    fetchStudentsAppliedForTranscript();
  }, []);

  return !loggedIn || user.role !== 'admin' ? (
    navigate('/')
  ) : (
    <Container>
      <Table
        tableTitle={'Transcript Requests'}
        column={columns}
        area={columnsArea}
        data={data}
        noMargin={true}
        width="70vw"
      ></Table>
    </Container>
  );
}

export default ApproveTranscript;
