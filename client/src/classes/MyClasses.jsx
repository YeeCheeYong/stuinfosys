import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Cards from './Cards';
import { useNavigate } from 'react-router-dom';
import { NoDataContainer } from '../components/Table';
import { AuthContext } from '../context/authContext';

const CourseContainer = styled.div`
  display: flex;
  margin: 5vw;
  flex-wrap: wrap;
`;

function MyClasses() {
  const [myClasses, setMyClasses] = useState();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchClasses = () => {
    const uri = '/api/v1/class/myclasses';
    axios
      .get(uri)
      .then((res) => {
        setMyClasses(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (!user || user.role == 'admin') navigate('/');

  return (
    <CourseContainer>
      {myClasses &&
        myClasses.map((myClass, id) => {
          return (
            <Cards
              key={id}
              title={myClass.course_id + ' - ' + myClass.class_id}
              subTitle={`Teacher: ${myClass.teacher}`}
              value={`${myClass.fee}$`}
              description={myClass.description}
              isActive={myClass.isGoingOn}
              onDetails={() => navigate(`/class/details/${myClass.class_id}`)}
            />
          );
        })}
      {!myClasses ||
        (!(myClasses?.length && myClasses.length > 0) && (
          <NoDataContainer>No Data Found!</NoDataContainer>
        ))}
    </CourseContainer>
  );
}

export default MyClasses;
