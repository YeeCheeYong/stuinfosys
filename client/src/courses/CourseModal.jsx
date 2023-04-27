import React, { useState } from 'react';
import styled from 'styled-components';
// import Button from '../components/Button';
import axios from 'axios';
import { useToast, Button, Flex, Box } from '@chakra-ui/react';
import { Input, Label, Form, TextArea, InputGroup } from '../components/Utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  width: 50vw;
  min-width: 320px;
  margin-top: 10px;
  @media (max-width: 600px) {
    width: 100vw;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const CourseModal = (props) => {
  const [courseTitle, setCourseTitle] = useState(props.title);
  const [courseDetails, setCourseDetails] = useState(props.description);
  const [courseId, setCourseId] = useState(props.course_id);
  const [courseCredit, setCourseCredit] = useState(props.credit);
  const [coursePreRequisit, setCoursePreRequisit] = useState(
    props.prerequisites && props.prerequisites.length > 0
      ? props.prerequisites.join(',')
      : undefined
  );
  const [isActive, setIsActive] = useState(props.isActivated);
  const toast = useToast();

  const handleUpdate = async (event) => {
    const uri = `/api/v1/course/${courseId}`;
    event.preventDefault();
    const data = {
      course_id: courseId,
      title: courseTitle,
      description: courseDetails,
      isActivated: isActive,
      prerequisites:
        coursePreRequisit?.split(',').map((item) => item.trim()) || [],
    };
    await axios
      .patch(uri, data)
      .then((res) => {
        toast({
          title: 'Course Updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        props.onComplete();
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

  const handleCreate = async (event) => {
    event.preventDefault();
    const data = {
      course_id: courseId,
      title: courseTitle,
      description: courseDetails,
      credit: courseCredit,
      prerequisites:
        coursePreRequisit?.split(',').map((item) => item.trim()) || [],
    };

    const uri = '/api/v1/course';

    await axios
      .post(uri, data)
      .then((res) => {
        toast({
          title: 'Course Created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        props.onComplete();
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
      <Form onSubmit={props.course_id ? handleUpdate : handleCreate}>
        <Label>Title:</Label>
        <Input
          id="title"
          type="text"
          value={courseTitle}
          placeholder="Artificial Intelligence"
          onChange={(e) => setCourseTitle(e.target.value)}
          required
        />

        <Label>Course Id:</Label>
        <Input
          id="id"
          type="text"
          placeholder="SWE123"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          readOnly={props.course_id ? true : false}
          style={{
            opacity: props.course_id ? 0.4 : 1, // Reduce opacity if readonly
            cursor: props.course_id ? 'not-allowed' : 'auto', // Change cursor to not-allowed if readonly
          }}
          required
        />
        <Flex>
          <Label>Active:</Label>
          <Input
            id="status"
            type="checkbox"
            checked={props.course_id ? isActive : true}
            onChange={(e) => setIsActive(e.target.checked)}
          />

          <Label>Credit: </Label>
          <Box ml={8}>
            <Input
              id="credit"
              placeholder="4.00"
              type="number"
              value={courseCredit}
              required
              onChange={(e) => setCourseCredit(e.target.value)}
            />
          </Box>
        </Flex>

        <Label>Pre-requisit:</Label>
        <Input
          id="pre-requisit"
          type="text"
          placeholder="SWE123,CSE350"
          value={coursePreRequisit}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (!inputValue || inputValue === '') {
              setCoursePreRequisit(undefined);
            } else {
              setCoursePreRequisit(inputValue);
            }
          }}
          pattern="^(?!.*[ ,]$)[^ ]+$"
          title="Input cannot contain spaces or comma at the end"
        />

        <Label htmlFor="details">Course Details:</Label>
        <TextArea
          id="details"
          placeholder="Details"
          required
          rows="3"
          value={courseDetails}
          onChange={(e) => setCourseDetails(e.target.value)}
        />
        <ButtonContainer>
          <Button colorScheme="red" size="sm" onClick={() => props.hideModal()}>
            Cancel
          </Button>
          <Button colorScheme="teal" size="sm" type="submit">
            {props.course_id ? 'Update' : 'Create'}
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default CourseModal;
