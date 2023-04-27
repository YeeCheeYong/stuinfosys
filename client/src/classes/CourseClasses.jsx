import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { chakra } from '@chakra-ui/react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import Cards from './Cards';
import MySpinner from '../components/Spinner';

const HeadlineContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const ClassContainer = styled.div`
  display: flex;
  margin: 5vw;
  flex-wrap: wrap;
`;

function CourseClasses() {
  const { courseId } = useParams();
  const [classes, setClasses] = useState();
  const [courseTitle, setCourseTitle] = useState('');
  const navigate = useNavigate();
  const [requestState, setRequestState] = useState('loading');
  const { user } = useContext(AuthContext);
  const fetchClasses = () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const uri = `/api/v1/course/${courseId}/class`;
    axios
      .get(uri, config)
      .then((res) => {
        setClasses(res.data.result);
        setCourseTitle(res.data.courseTitle.title);
        setRequestState('loaded');
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchClasses();
  }, []);
  if (requestState === 'loading') return <MySpinner />;

  return (
    <>
      <HeadlineContainer>
        <chakra.h1
          fontSize="30"
          fontWeight="bold"
          mt={3}
          color="gray.800"
          _dark={{ color: 'white' }}
        >
          {courseTitle}
        </chakra.h1>
      </HeadlineContainer>
      <ClassContainer
        _dark={{ bg: '#3e3e3e' }}
        p={50}
        w="full"
        alignItems="center"
        justifyContent="center"
      >
        {classes &&
          classes
            .filter(
              (cur_class) =>
                cur_class.isGoingOn ||
                (user && user.role == 'admin' && !cur_class.isGoingOn)
            )
            .map((cur_class, id) => (
              <Cards
                key={id}
                title={`${cur_class.course_id} - ${cur_class.class_id}`}
                subTitle={`Class Teacher : ${cur_class.teacher}`}
                value={`${cur_class.fee}$`}
                description={cur_class.description}
                isActive={cur_class.isGoingOn}
                onDetails={() =>
                  navigate(`/class/details/${cur_class.class_id}`)
                }
              />
            ))}
      </ClassContainer>
    </>
  );
}
export default CourseClasses;
