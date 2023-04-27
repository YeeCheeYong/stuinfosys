import React, { useState } from 'react';
import TimePicker from 'rc-time-picker';
import moment, { weekdays } from 'moment';
import styled from 'styled-components';
import 'rc-time-picker/assets/index.css';
import { Button } from '@chakra-ui/react';
import {
  FlexCol,
  FlexRow,
  Form,
  Input,
  Label,
  TextArea,
} from '../components/Utils';

const Select = styled.select`
  width: 100px;
  background-color: #c5eaed;
  text-align: center;
  border-bottom: 1px solid;
  border-radius: 5px;
  height: 24px;
`;

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    height: '10px', // set the minimum height of the control
    width: '90px', // set the desired width of the control
    borderRadius: '4px', // set the border radius
    borderColor: state.isFocused ? 'blue' : 'grey', // set border color when focused or not
    boxShadow: state.isFocused ? '0 0 0 1px blue' : 'none', // set box shadow when focused or not
  }),
  // other custom styles for other elements such as menu, option, etc.
};

const TimeScheduleForm = (props) => {
  //   const [props.schedules, props.setSchedules] = useState([
  //     { weekdays: null, startTime: null, endTime: null } // Initial schedule
  //   ]);

  const weekdaysOptions = [
    { value: 'Sat', label: 'Sat' },
    { value: 'Sun', label: 'Sun' },
    { value: 'Mon', label: 'Mon' },
    { value: 'Tue', label: 'Tue' },
    { value: 'Wed', label: 'Wed' },
    { value: 'Thu', label: 'Thu' },
    { value: 'Fri', label: 'Fri' },

    // Add other weekdays options here
  ];

  const handleWeekdaysChange = (index, selectedOption) => {
    const newSchedules = [...props.schedules];
    newSchedules[index].weekdays = selectedOption;
    props.setSchedules(newSchedules);
  };

  const handleStartTimeChange = (index, momentObj) => {
    const newSchedules = [...props.schedules];
    newSchedules[index].startTime = momentObj;
    props.setSchedules(newSchedules);
  };

  const handleEndTimeChange = (index, momentObj) => {
    const newSchedules = [...props.schedules];
    newSchedules[index].endTime = momentObj;
    props.setSchedules(newSchedules);
  };

  const handleAddSchedule = (event) => {
    event.preventDefault();
    const hasEmptyFields = props.schedules.some(
      (schedule) =>
        !schedule.weekdays || !schedule.startTime || !schedule.endTime
    );

    if (hasEmptyFields) {
      alert('Fill the current schedule before adding new schedule.'); // Show error message
      return; // Return early and prevent addition of new input
    }

    props.setSchedules([
      ...props.schedules,
      { weekdays: null, startTime: null, endTime: null },
    ]);
  };

  const handleRemoveSchedule = (index) => {
    const newSchedules = [...props.schedules];
    newSchedules.splice(index, 1);
    props.setSchedules(newSchedules);
  };

  const isEndTimeValid = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return true;
    }
    return moment(endTime).isAfter(moment(startTime));
  };

  return (
    <div>
      {props.schedules.map((schedule, index) => (
        <div key={index}>
          <FlexRow>
            {/* <Select
              options={weekdaysOptions}
              value={schedule.weekdays}
              onChange={(selectedOption) =>
                handleWeekdaysChange(index, selectedOption)
              }
              placeholder="Days"
              required
              styles={customSelectStyles}
            /> */}
            <Select
              value={schedule.weekdays}
              onChange={(selectedOption) =>
                handleWeekdaysChange(index, selectedOption.target.value)
              }
            >
              <option value="">Day</option>
              <option value="Sun">Sun</option>
              <option value="Mon">Mon</option>
              <option value="Tue">Tue</option>
              <option value="Wed">Wed</option>
              <option value="Thu">Thu</option>
              <option value="Fri">Fri</option>
              <option value="Sat">Sat</option>
            </Select>
            <TimePicker
              defaultValue={schedule.startTime}
              onChange={(momentObj) => handleStartTimeChange(index, momentObj)}
              format="hh:mm:A"
              showSecond={false}
              allowEmpty={false}
              inputReadOnly
              placeholder="Start Time"
              required
            />
            <TimePicker
              defaultValue={schedule.endTime}
              onChange={(momentObj) => handleEndTimeChange(index, momentObj)}
              format="hh:mm:A"
              showSecond={false}
              allowEmpty={false}
              inputReadOnly
              placeholder="End Time  "
              disabled={!schedule.startTime}
              // Add validation for end time
              className={
                !isEndTimeValid(schedule.startTime, schedule.endTime)
                  ? 'invalid'
                  : ''
              }
              required
            />

            <Button
              size="xs"
              colorScheme="orange"
              onClick={() => handleRemoveSchedule(index)}
            >
              Remove
            </Button>
          </FlexRow>
          {/* <button onClick={() => handleRemoveSchedule(index)}>Remove</button> */}
        </div>
      ))}
      {/* <button onClick={handleAddSchedule}>Add Schedule</button> */}
      <Button
        type="submit"
        size="xs"
        colorScheme="cyan"
        onClick={(e) => handleAddSchedule(e)}
      >
        Add Schedule
      </Button>
    </div>
  );
};

export default TimeScheduleForm;
