import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import CourseModal from './CourseModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button as MyCustomButton } from '@chakra-ui/react';
import Cards from '../classes/Cards';
import { AuthContext } from '../context/authContext';
import MySpinner from '../components/Spinner';

const CourseContainer = styled.div`
  display: flex;
  margin: 5vw;
  flex-wrap: wrap;
  margin-top: 60px;
  @media screen and (max-width: 768px) {
    margin-top: 0px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;
const SearchBar = styled.input`
  position: absolute;
  top: 85px;
  right: 20px;
  width: 270px;
  height: 40px;
  padding: 0 10px;
  border-radius: 20px;
  border: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

  @media screen and (max-width: 768px) {
    position: relative;
    top: 0px;
    margin-top: 0px;
    width: 260px;
    margin: 40px;
    margin-bottom: 30px;
    left: 8vw;
  }
`;

function Courses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [requestState, setRequestState] = useState('loading');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchCourses = () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const uri = '/api/v1/course/';
    axios
      .get(uri, config)
      .then((res) => {
        setCourses(res.data.result);
        setRequestState('loaded');
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(
      courses &&
        courses.filter(
          (course) =>
            (course.title &&
              course.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (course.course_id &&
              course.course_id
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
        )
    );
  }, [courses, searchQuery]);

  if (requestState === 'loading') return <MySpinner />;

  return (
    <>
      {user && user.role == 'admin' && (
        <ButtonContainer>
          <MyCustomButton
            colorScheme="teal"
            size="lg"
            version="success"
            onClick={() => handleModal()}
          >
            Create Course
          </MyCustomButton>
        </ButtonContainer>
      )}
      {isModalOpen && (
        <Modal>
          <CourseModal
            onComplete={() => fetchCourses()}
            hideModal={handleModal}
          />
        </Modal>
      )}
      <SearchBar
        type="text"
        placeholder="Search courses by name or code"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <CourseContainer>
        {filteredCourses &&
          filteredCourses
            .filter(
              (course) =>
                course.isActivated ||
                (user && user.role == 'admin' && !course.isActivated)
            )
            .map((course, id) => (
              <Cards
                key={id}
                title={course.title}
                subTitle={`Course Code: ${course.course_id}`}
                value={`${course.credit}.0 credit`}
                description={course.description}
                isActive={course.isActivated}
                buttonColor="cyan"
                onDetails={() =>
                  navigate(`/course/details/${course.course_id}`)
                }
              />
            ))}
      </CourseContainer>
    </>
  );
}

export default Courses;
