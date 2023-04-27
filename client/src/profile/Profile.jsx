import { Button, useToast, Badge, Box } from '@chakra-ui/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from '../components/Modal';
import Result from './Result';
import { AuthContext } from '../context/authContext';
import Table, { NoDataContainer } from '../components/Table';
import DownloadTranscript from './TranscriptDonwloader';
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
  margin-bottom: 30px;
  padding: 24px;
  @media (max-width: 600px) {
    width: 100vw;
    margin-top: 0px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: underline;
`;

const Header = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: x-large;
  overflow: hidden;
`;

const ClassScheduleTitle = styled(Title)`
  text-align: center;
  border-top: 1px solid green;
  padding-top: 24px;
`;

const HeaderButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DayContainer = styled.div`
  font-size: x-large;
  margin-bottom: 8px;
`;

const Profile = (props) => {
  const params = useParams();
  const username = params.username;
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState();
  const [isShowModal, setIsShowModal] = useState(false);
  const toast = useToast();
  const { loggedIn, logoutHandler, user } = useContext(AuthContext);
  const [allSchedules, setAllSchedule] = useState();
  const [requestState, setRequestState] = useState('loading');

  const dayMapper = {
    Sun: 'Sunday',
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
  };

  const columns = ['Class', 'Course', 'Start Time', 'End Time'];
  const columnsArea = {
    Class: '20%',
    Course: '30%',
    'Start Time': '25%',
    'End Time': '25%',
  };

  const getUserDetails = () => {
    const uri = `/api/v1/user/${username}`;
    axios
      .get(uri)
      .then((res) => {
        setUserDetails(res.data.user);
      })
      .catch((err) => console.log(err));
  };

  const getUserClassSchedule = () => {
    const uri = `/api/v1/user/${username}/class-schedule`;
    axios
      .get(uri)
      .then((res) => {
        setAllSchedule(res.data.data.schedules);
        setRequestState('loaded');
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserDetails();
    getUserClassSchedule();
  }, [username]);

  const applyForTranscript = () => {
    const uri = '/api/v1/user/transcript';
    axios
      .patch(uri)
      .then((res) => {
        toast({
          title: 'Applied for Transcript',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        getUserDetails();
      })
      .catch((err) => console.log(err));
  };
  if (!loggedIn) return navigate('/');
  else if (requestState === 'loading') return <MySpinner />;
  else
    return (
      <Container>
        <HeaderContainer>
          <Header>
            <Title>
              {userDetails?.first_name} {userDetails?.last_name}
            </Title>
            <div>Username: {userDetails?.username}</div>
            <div>Email: {userDetails?.email}</div>
            <Box>
              <Badge width="15" variant="solid" colorScheme="green">
                {userDetails?.role}
              </Badge>
            </Box>
            {userDetails?.description && (
              <div>Info: {userDetails?.description}</div>
            )}
            {userDetails?.role === 'student' && (
              <div>G.P.A.: {userDetails?.gpa}</div>
            )}
          </Header>
          {userDetails && (
            <HeaderButtonContainer>
              {user?.role === 'student' &&
                user?.username === userDetails?.username && (
                  <>
                    {!userDetails?.isTranscriptPending && (
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={applyForTranscript}
                      >
                        {userDetails?.transcript_grades.length > 0
                          ? 'Refresh Transcript'
                          : 'Apply for Transcript'}
                      </Button>
                    )}
                    {userDetails?.isTranscriptPending && (
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={applyForTranscript}
                      >
                        {userDetails?.transcript_grades.length > 0
                          ? 'Transcript Refresh Pending'
                          : 'Transcript Application Pending'}
                      </Button>
                    )}
                    {userDetails?.transcript_grades.length > 0 && (
                      <Button
                        colorScheme="cyan"
                        size="sm"
                        onClick={() => DownloadTranscript(userDetails)}
                      >
                        Download Transcript
                      </Button>
                    )}
                  </>
                )}
              {((user?.role === 'admin' && userDetails?.role === 'student') ||
                (user?.role === 'student' &&
                  user?.username === userDetails?.username)) && (
                <Button
                  colorScheme="orange"
                  size="sm"
                  onClick={() => setIsShowModal(true)}
                >
                  View Results
                </Button>
              )}

              {isShowModal && (
                <Modal>
                  <Result
                    username={userDetails?.username}
                    onClose={() => setIsShowModal(false)}
                  />
                </Modal>
              )}
            </HeaderButtonContainer>
          )}
        </HeaderContainer>
        {userDetails &&
          ((user?.role === 'student' &&
            user?.username === userDetails?.username) ||
            (user?.role === 'admin' && userDetails?.role === 'student')) && (
            <>
              <ClassScheduleTitle>Class Schedule</ClassScheduleTitle>
              {allSchedules &&
                allSchedules.length > 0 &&
                allSchedules.map((scheduleObj, id) => {
                  const day = Object.entries(scheduleObj)[0][0];
                  const schedule = Object.entries(scheduleObj)[0][1];
                  const data = [];
                  schedule.forEach((sch) => {
                    data.push({
                      Course: (
                        <StyledLink to={`/course/details/${sch.course_id}`}>
                          {sch.course_id}
                        </StyledLink>
                      ),
                      'Start Time': sch.start,
                      'End Time': sch.end,
                      Class: (
                        <StyledLink to={`/class/details/${sch.class_id}`}>
                          {sch.class_id}
                        </StyledLink>
                      ),
                    });
                  });
                  return (
                    <React.Fragment key={id}>
                      <DayContainer>{dayMapper[day]}</DayContainer>
                      <Table
                        column={columns}
                        area={columnsArea}
                        data={data}
                        noMargin={true}
                        small={true}
                      />
                    </React.Fragment>
                  );
                })}
              {!allSchedules ||
                (!allSchedules?.length > 0 && (
                  <NoDataContainer>No Data Found!</NoDataContainer>
                ))}
            </>
          )}
      </Container>
    );
};

export default Profile;
