import React, { useState } from 'react';
import styled from 'styled-components';
// import Button from '../components/Button';
import axios from 'axios';
import { useToast, Button, Flex, Box } from '@chakra-ui/react';
import moment, { weekdays } from 'moment';
import { format, parse } from 'date-fns';
import {
  FlexCol,
  FlexRow,
  Form,
  Input,
  Label,
  TextArea,
} from '../components/Utils';
import { useParams } from 'react-router-dom';
import TimeScheduleForm from '../components/TimeScheduleForm';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 35vw;
  min-width: 330px;
  padding: 2px;
  overflow: 'auto';
  margin-top: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 24px;
  margin-bottom: 10px;
`;

const FullDiv = styled.div`
  width: 100%;
`;

const ClassModal = (props) => {
  const [teacher, setTeacher] = useState(props.teacher);
  const [description, setDescription] = useState(props.description);
  const [fee, setFee] = useState(props.fee);
  const [isActive, setIsActive] = useState(props.isGoingOn);
  const params = useParams();
  const { courseId } = params;
  const toast = useToast();

  const [schedules, setSchedules] = useState(
    props.schedules && props.schedules.length > 0
      ? props.schedules.map((timeString) => {
          const [weekdays, startTime, endTime] = timeString.split('-');
          return {
            weekdays,
            startTime: moment(startTime, 'hh:mm:A'),
            endTime: moment(endTime, 'hh:mm:A'),
          };
        })
      : [
          { weekdays: null, startTime: null, endTime: null }, // Initial schedule
        ]
  );

  const handleUpdate = async (event) => {
    event.preventDefault();
    const class_schedules = [];
    schedules.forEach((schedule, index) => {
      if (schedule.weekdays && schedule.startTime && schedule.endTime) {
        class_schedules.push(
          schedule.weekdays +
            '-' +
            moment(schedule.startTime).format('hh:mm:A') +
            '-' +
            moment(schedule.endTime).format('hh:mm:A')
        );
      }
    });
    const data = {
      teacher,
      description,
      schedules: class_schedules,
      fee,
      isGoingOn: isActive,
    };
    const uri = `/api/v1/class/${props.class_id}`;

    await axios
      .patch(uri, data)
      .then((res) => {
        toast({
          title: 'Class Updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });

    props.hideModal();
    props.onComplete();
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const class_schedules = [];
    schedules.forEach((schedule, index) => {
      if (schedule.weekdays && schedule.startTime && schedule.endTime) {
        class_schedules.push(
          schedule.weekdays +
            '-' +
            moment(schedule.startTime).format('hh:mm:A') +
            '-' +
            moment(schedule.endTime).format('hh:mm:A')
        );
      }
    });
    const data = {
      teacher,
      description,
      course_id: courseId,
      schedules: class_schedules,
      fee,
    };
    const uri = `/api/v1/class`;

    await axios
      .post(uri, data)
      .then((res) => {
        toast({
          title: 'Class Created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });

    props.hideModal();
  };

  return (
    <Container>
      <Form onSubmit={props.class_id ? handleUpdate : handleCreate}>
        <FullDiv>
          <FlexCol>
            <Label>Teacher:</Label>
            <Input
              id="teacher"
              type="text"
              value={teacher}
              placeholder="Username"
              onChange={(e) => setTeacher(e.target.value)}
              required
            />
          </FlexCol>
          <Flex>
            <Label>Active:</Label>
            <Input
              id="status"
              type="checkbox"
              checked={props.class_id ? isActive : true}
              onChange={(e) => setIsActive(e.target.checked)}
            />

            <Label>Fee:</Label>
            <Box ml={7}>
              <Input
                id="fee"
                type="number"
                value={fee}
                placeholder="180$"
                onChange={(e) => setFee(e.target.value)}
                required
              />
            </Box>
          </Flex>
        </FullDiv>
        <FlexCol>
          <Label htmlFor="details">Class Details:</Label>
          <TextArea
            id="description"
            placeholder="Details"
            required
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FlexCol>
        <FlexCol>
          <Label>Schedules:</Label>
          <TimeScheduleForm
            className="time-picker"
            schedules={schedules}
            setSchedules={setSchedules}
          ></TimeScheduleForm>
        </FlexCol>
        <ButtonContainer>
          <Button colorScheme="red" size="sm" onClick={() => props.hideModal()}>
            Cancel
          </Button>
          <Button colorScheme="teal" size="sm" type="submit">
            {props.class_id ? 'Update' : 'Create'}
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default ClassModal;
