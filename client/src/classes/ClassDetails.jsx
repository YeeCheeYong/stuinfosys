import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Badge,
  Button,
  useToast,
  Icon,
  Flex,
  Box,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';
import { EditIcon } from '@chakra-ui/icons';
import { useParams, Link } from 'react-router-dom';
import Modal from '../components/Modal';
import ApproveJoinRequests from './ApproveJoinRequests';
import Gradings from './Gradings';
import Table from '../components/Table';
import Payment from '../components/Payment';
import { AuthContext } from '../context/authContext';
import MySpinner from '../components/Spinner';
import ClassModal from './ClassModal';

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
  @media (max-width: 600px) {
    width: 100vw;
    margin-top: 0px;
  }
`;

const Title = styled.div`
  font-size: x-large;
  overflow: hidden;
`;
const StyledLink = styled(Link)`
  text-decoration: underline;
`;
const ClassButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  margin-left: auto;
`;

const Details = styled.div`
  padding-top: 24px;
  overflow: hidden;
`;

const Header = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid;
`;

const HeaderButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TableContainer = styled.div`
  margin: 20px 0px;
  display: flex;
  gap: 40px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid green;
  padding-top: 10px;
`;

const TableTitle = styled.div`
  flex-direction: column;
  text-align: center;
  font-size: xx-large;
  font-weight: bold;
`;

const DivRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

function ClassDetails() {
  const [details, setDetails] = useState();
  const [isShowModal, setIsShowModal] = useState(false);
  const [classUpdateModalOpen, setClassUpdateModalOpen] = useState(false);
  const [requestState, setRequestState] = useState('loading');

  const handleClassUpdateModal = () => {
    setClassUpdateModalOpen(!classUpdateModalOpen);
  };

  const [data, setData] = useState();
  const params = useParams();
  const id = params.classId;
  const toast = useToast();
  const { user, loggedIn } = useContext(AuthContext);

  const fetchClass = async () => {
    const uri = `/api/v1/class/${id}`;

    await axios
      .get(uri)
      .then((res) => {
        const tempData = [];
        res.data.result.schedules.forEach((schedule) => {
          const date = schedule.split('-')[0];
          const startTime = schedule.split('-')[1];
          const endTime = schedule.split('-')[2];
          tempData.push({
            Day: date,
            'Start Time': startTime,
            'End Time': endTime,
          });
        });
        setData(tempData);
        setDetails(res.data.result);
        setRequestState('loaded');
      })
      .catch((err) => console.log(err));
  };

  const onEnrollButtonClick = async () => {
    const verificationURI = `/api/v1/class/${id}/enrolment-verification`;
    await axios
      .get(verificationURI)
      .then((res) => {
        setIsShowModal('payment');
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const onPaymentSuccessful = async () => {
    const uri = `/api/v1/class/${id}`;
    await axios
      .post(uri)
      .then((res) => {
        setIsShowModal();
        fetchClass();
        toast({
          title:
            'Payment Completed, Class Enrolment Request Sent Successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: `Something Went Wrong, Try again Later`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    fetchClass();
  }, []);

  const columns = ['Day', 'Start Time', 'End Time'];

  const columnsArea = {
    Day: '40%',
    'Start Time': '30%',
    'End Time': '30%',
  };
  if (requestState === 'loading') return <MySpinner />;

  return (
    <>
      <Container>
        {isShowModal && (
          <Modal>
            {loggedIn &&
              user.role !== 'student' &&
              isShowModal === 'pendings' && (
                <ApproveJoinRequests
                  hideModal={() => setIsShowModal(false)}
                  pendingStudents={details?.pending_students}
                  refetchData={fetchClass}
                  classId={details?.class_id}
                  classTeacher={details?.teacher}
                  classActive={details?.isGoingOn}
                />
              )}
            {isShowModal === 'gradings' && (
              <Gradings
                hideModal={() => setIsShowModal(false)}
                refetchData={fetchClass}
                classId={details?.class_id}
                classTeacher={details?.teacher}
                classActive={details?.isGoingOn}
              />
            )}
            {isShowModal === 'payment' && (
              <Payment
                onSubmit={() => onPaymentSuccessful()}
                onCancel={() => setIsShowModal()}
                fee={details?.fee}
              />
            )}
          </Modal>
        )}
        {classUpdateModalOpen && (
          <Modal>
            <ClassModal
              onComplete={fetchClass}
              {...details}
              hideModal={handleClassUpdateModal}
            />
          </Modal>
        )}
        <HeaderContainer>
          <Header>
            <Flex>
              {/* <Heading my={3} as="h5" sz="lg">
                {details?.course?.title} - {details?.course?.course_id} -{' '}
                {details?.class_id}
              </Heading> */}
              <Heading my={3} as="h5" sz="lg">
                <Link
                  to={`/course/details/${details?.course_id}`}
                  textDecoration="none" // Set textDecoration to "none"
                >
                  {details?.course?.title} - {details?.course?.course_id} -{' '}
                  {details?.class_id}
                </Link>
              </Heading>

              {user && user.role == 'admin' && (
                <Button
                  p="0"
                  ml="5"
                  onClick={() => handleClassUpdateModal()}
                  background="none"
                  border="none"
                  boxShadow="none !important"
                >
                  <Icon as={EditIcon} />
                </Button>
              )}
            </Flex>
            <div>
              Teacher :{' '}
              <Link to={`/user/${details?.teacher}`}>
                {details?.user.first_name + ' ' + details?.user.last_name}
              </Link>
            </div>
            <div>Total Students: {details?.approved_students?.length}</div>
            <div>Credit: {details?.course?.credit}</div>
            <DivRow>
              {details?.course.prerequisites.length > 0 ? (
                <>Prerequisites :</>
              ) : (
                <></>
              )}
              {details?.course?.prerequisites.map((pre, id) => (
                <Badge key={id} colorScheme="purple">
                  {pre}
                </Badge>
              ))}
            </DivRow>
            <Box>
              {details?.isGoingOn ? (
                <>
                  <Badge width="15" variant="solid" colorScheme="green">
                    Active
                  </Badge>
                  <Badge ml={2} width="15" variant="solid" colorScheme="purple">
                    {details?.fee}$
                  </Badge>
                </>
              ) : (
                <Badge width="15" variant="solid" colorScheme="red">
                  Inactive
                </Badge>
              )}
            </Box>
            {/* <div>Availability: {details?.isGoingOn ? 'Yes' : 'No'}</div> */}
          </Header>
          {loggedIn && (
            <HeaderButtonContainer>
              {(user.role === 'admin' ||
                (user.role === 'teacher' &&
                  details?.teacher === user.username)) && (
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => setIsShowModal('pendings')}
                >
                  Pending students
                </Button>
              )}
              {(details?.approved_students.includes(user.username) ||
                user.role === 'admin' ||
                (user.role === 'teacher' &&
                  details?.teacher === user.username)) && (
                <Button
                  colorScheme="cyan"
                  size="sm"
                  onClick={() => setIsShowModal('gradings')}
                >
                  Gradings
                </Button>
              )}
              {user?.role === 'student' &&
                details?.isGoingOn &&
                !details?.approved_students.includes(user.username) &&
                !details?.pending_students.includes(user.username) && (
                  <ClassButtons>
                    <Button
                      colorScheme="teal"
                      size="sm"
                      onClick={onEnrollButtonClick}
                    >
                      Enroll
                    </Button>
                  </ClassButtons>
                )}
              {user?.role === 'student' &&
                details?.isGoingOn &&
                details?.pending_students.includes(user.username) && (
                  <ClassButtons>
                    <Button colorScheme="red" size="sm">
                      Enrolment Pending
                    </Button>
                  </ClassButtons>
                )}
            </HeaderButtonContainer>
          )}
        </HeaderContainer>

        <Details>{details?.description} </Details>

        <TableContainer>
          <TableTitle>Class Schedule</TableTitle>
          <Table
            key={details?.schedules}
            column={columns}
            area={columnsArea}
            data={data}
            noMargin={true}
            small={true}
          />
        </TableContainer>
      </Container>
    </>
  );
}

export default ClassDetails;
