import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
// import Button from '../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Flex, Icon, Heading, Badge, Box } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import axios from 'axios';
import Modal from '../components/Modal';
import ClassModal from '../classes/ClassModal';
import CourseModal from './CourseModal';
import { AuthContext } from '../context/authContext';
import MySpinner from '../components/Spinner';

const Container = styled.div`
  width: 70%;
  border-radius: 10px;
  margin: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-flow: column;
  margin: auto;
  margin-top: 40px;
  padding: 24px;
  position: relative;
  min-height: 40vh;

  @media (max-width: 600px) {
    width: 100vw;
    margin-top: 0px;
  }
`;

const Title = styled.div`
  font-size: x-large;
  overflow: hidden;
`;

const ClassButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 130px;
  margin-left: auto;
`;

const Details = styled.div`
  border-top: 1px solid;
  padding-top: 24px;
  overflow: hidden;
`;

const Header = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`;

function CourseDetails() {
  const navigate = useNavigate();
  const [details, setDetails] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const id = params.courseId;
  const { user } = useContext(AuthContext);
  const [requestState, setRequestState] = useState('loading');

  const [courseUpdateModalOpen, setCourseUpdateModalOpen] = useState(false);

  const handleCourseUpdateModal = () => {
    setCourseUpdateModalOpen(!courseUpdateModalOpen);
  };

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchCourse = () => {
    const uri = `/api/v1/course/${id}`;
    axios
      .get(uri)
      .then((res) => {
        setDetails(res.data);
        setRequestState('loaded');
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchCourse();
  }, []);

  if (requestState === 'loading') return <MySpinner />;

  return (
    <>
      <Container>
        {isModalOpen && (
          <Modal>
            <ClassModal hideModal={handleModal} />
          </Modal>
        )}
        {courseUpdateModalOpen && (
          <Modal>
            <CourseModal
              onComplete={fetchCourse}
              {...details}
              hideModal={handleCourseUpdateModal}
            />
          </Modal>
        )}
        <Header>
          <Flex>
            <Heading as="h5" size="lg">
              {details?.title + ' - ' + details?.course_id || ''}
            </Heading>
            {user && user.role == 'admin' && (
              <Button
                p="0"
                ml="5"
                onClick={() => handleCourseUpdateModal()}
                background="none"
                border="none"
                boxShadow="none !important"
              >
                <Icon as={EditIcon} />
              </Button>
            )}
          </Flex>
          <Flex mt={3} mb={4}>
            <Box>
              {' '}
              <Badge width="15" variant="outline" colorScheme="green">
                {details?.credit}.0 credit
              </Badge>
            </Box>
            <Box ml={2}>
              {details?.isActivated ? (
                <Badge width="15" variant="solid" colorScheme="green">
                  Active
                </Badge>
              ) : (
                <Badge width="15" variant="solid" colorScheme="red">
                  Inactive
                </Badge>
              )}
            </Box>
          </Flex>
          <Box>
            {details?.prerequisites.length > 0 ? <>Prerequisites :</> : <></>}

            {details?.prerequisites.map((pre, id) => (
              <Badge ml={1} key={id} colorScheme="purple">
                {pre}
              </Badge>
            ))}
          </Box>
        </Header>
        <Details>{details?.description || ''}</Details>
        <ClassButtons>
          <Button
            colorScheme="cyan"
            size="sm"
            onClick={() => navigate(`/classes/${id}`)}
          >
            All classes
          </Button>
          {user && user.role == 'admin' && details?.isActivated && (
            <Button
              colorScheme="teal"
              size="sm"
              onClick={() => handleModal()}
              version={'success'}
            >
              Create Class
            </Button>
          )}
        </ClassButtons>
      </Container>
    </>
  );
}

export default CourseDetails;
