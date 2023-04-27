import React from 'react';
import styled from 'styled-components';
import Table from '../components/Table';
import Button from '../components/Button';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 50vw;
  display: flex;
  flex-flow: column;
  margin: auto;
  max-height: 80vh;
  overflow-y: scroll;
  @media (max-width: 600px) {
    width: 100vw;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 12px;
`;
const StyledLink = styled(Link)`
  text-decoration: underline;
`;

function Result(props) {
  const [results, setResults] = useState();
  const [data, setData] = useState([]);
  const columns = ['Class', 'Credit', 'Grade'];
  const columnsArea = {
    Class: '40%',
    Credit: '30%',
    Grade: '30%',
  };

  const fetchResults = async () => {
    const uri = `/api/v1/grade/student/${props.username}`;
    axios
      .get(uri)
      .then((res) => {
        setResults(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    if (results) {
      const extractedData = results.map((result) => {
        return {
          Class: (
            <StyledLink to={`/class/details/${result.class_id}`}>
              {result.course_id + '-' + result.class_id}
            </StyledLink>
          ),
          Credit: result.credit,
          Grade: result.grade === null ? 'null' : result.grade,
        };
      });
      setData(extractedData);
    }
  }, [results]);

  return (
    <Container>
      <Table
        column={columns}
        area={columnsArea}
        data={data}
        noMargin={true}
      ></Table>
      <ButtonContainer>
        <Button
          width={'30vw'}
          version="secondary"
          onClick={() => props.onClose()}
        >
          Close
        </Button>
      </ButtonContainer>
    </Container>
  );
}

export default Result;
