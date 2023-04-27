import React, { useEffect, useState, useContext } from 'react';
// import Button from '../components/Button';
import { Button } from '@chakra-ui/react';
import Table from '../components/Table';
import styled from 'styled-components';
import axios from 'axios';
import { Input } from '../components/Utils';
import { useToast } from '@chakra-ui/react';
import { AuthContext } from '../context/authContext';

const ChangedSelect = styled.select`
  margin-bottom: 0;
  width: 100px;
`;

const Container = styled.div`
  width: 50vw;
  display: flex;
  flex-flow: column;
  margin: auto;
  max-height: 80vh;
  overflow-y: scroll;

  @media (max-width: 600px) {
    width: 100vw;
    margin-top: 0px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 12px;
`;

const InputContainer = styled.div`
  display: flex;
  margin-left: 5vw;
  align-items: center;
`;

function Gradings(props) {
  const { user, loggedIn } = useContext(AuthContext);
  const columns = ['student', 'grade', 'action'];
  const columnsArea = {
    student: '60%',
    action: '40%',
  };
  const data = [];
  const [grades, setGrades] = useState();

  const changeGrade = (id, grade) => {
    const newGrade = [...grades];
    newGrade[id] = {
      class_id: newGrade[id].class_id,
      username: newGrade[id].username,
      credit: newGrade[id].credit,
      grade,
    };
    setGrades(newGrade);
  };
  const toast = useToast();

  useEffect(() => {
    axios.get(`/api/v1/grade/class/${props.classId}`).then((res) => {
      const datas = res.data;
      const newData = [];
      datas.forEach((data) => {
        const { class_id, credit, grade, username } = data;
        newData.push({ class_id, credit, grade, username });
      });
      setGrades(newData);
    });
  }, []);

  grades?.forEach((student, idx) => {
    const obj = {
      student: student.username,
      grade: student.grade ? student.grade : 'null',
      action: loggedIn && user.role === 'teacher' && props.classActive && (
        <InputContainer key={idx}>
          <ChangedSelect
            backgroundColor={'white'}
            value={student.grade}
            onChange={(e) => changeGrade(idx, e.target.value)}
          >
            <option value={null}>-- Select Grade --</option>
            <option key={0.0} value={0.0}>
              {0.0}
            </option>
            {Array.from(
              { length: (4.0 - 2.0) / 0.25 + 1 },
              (_, i) => 2.0 + i * 0.25
            ).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </ChangedSelect>
        </InputContainer>
      ),
    };
    data.push(obj);
  });

  const submitGrades = async () => {
    const uri = `/api/v1/grade`;
    await axios.patch(uri, grades);
    toast({
      title: 'Grade changed!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    props.hideModal();
  };

  return (
    <Container>
      <Table
        tableTitle={'Grade of students'}
        column={columns}
        area={columnsArea}
        data={data}
        noMargin={true}
      ></Table>
      <ButtonContainer>
        <Button
          width={'10vw'}
          colorScheme="red"
          size="sm"
          onClick={() => props.hideModal()}
        >
          Close
        </Button>
        {user.role === 'teacher' &&
          user.username === props?.classTeacher &&
          props?.classActive && (
            <Button
              width={'10vw'}
              colorScheme="green"
              size="sm"
              onClick={submitGrades}
            >
              Submit
            </Button>
          )}
      </ButtonContainer>
    </Container>
  );
}

export default Gradings;
