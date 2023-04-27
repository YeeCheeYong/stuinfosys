import React, { useState } from 'react';
import TimePicker from 'react-time-picker';
import styled from 'styled-components';
import { Label } from './Utils';
import Button from './Button';
import { useToast } from '@chakra-ui/react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimePickerContainer = styled.div`
  display: flex;
  width: 100%;
  margin: auto;
  align-items: center;
  gap: 4px;
`;

const Select = styled.select`
  width: 100px;
  background-color: #c5eaed;
  text-align: center;
  border-bottom: 1px solid;
  border-radius: 5px;
  height: 24px;
  margin: auto;
`;

const StyledTimePicker = styled(TimePicker)`
  border-radius: 5px;
  background-color: #c5eaed;
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 5px;
`;

const ScheduleViewer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #d7fa9c;
  margin: 4px;
  padding-left: 4px;
  border: none;
  border-radius: 6px;
`;

function WeekdayTimePicker(props) {
  const [weekday, setWeekday] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  const handleWeekdayChange = (event) => {
    setWeekday(event.target.value);
  };

  const handleStartTimeChange = (newTime) => {
    setStartTime(newTime);
  };

  const handleEndTimeChange = (newTime) => {
    setEndTime(newTime);
  };

  const addSchedule = (event) => {
    event.preventDefault();
    const schdl = `${weekday}-${startTime}-${endTime}`;
    props.setSchedules((prevState) => [...prevState, schdl]);
  };

  return (
    <Container>
      {props.schedules &&
        props.schedules.map((schedule, id) => (
          <ScheduleViewer key={id}>{schedule}</ScheduleViewer>
        ))}
      <TimePickerContainer>
        <Select value={weekday} onChange={handleWeekdayChange}>
          <option value=""> --Day-- </option>
          <option value="SUN">Sunday</option>
          <option value="MON">Monday</option>
          <option value="TUE">Tuesday</option>
          <option value="WED">Wednesday</option>
          <option value="THU">Thursday</option>
          <option value="FRI">Friday</option>
          <option value="SAT">Saturday</option>
        </Select>
        From
        <StyledTimePicker
          value={startTime}
          disableClock={true}
          clearIcon={null}
          onChange={handleStartTimeChange}
        />
        To
        <StyledTimePicker
          value={endTime}
          disableClock={true}
          clearIcon={null}
          onChange={handleEndTimeChange}
        />
        <Button
          id="add"
          disabled={!weekday || !startTime || !endTime}
          version="small"
          onClick={(event) => addSchedule(event)}
        >
          Add
        </Button>
      </TimePickerContainer>
    </Container>
  );
}

export default WeekdayTimePicker;
