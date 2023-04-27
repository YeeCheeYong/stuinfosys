import React from 'react';
import { Spinner, Center } from '@chakra-ui/react'; // Import Spinner and Center components from Chakra UI

const MySpinner = () => {
  return (
    <Center h="70vh">
      {' '}
      {/* Use the Center component to center the Spinner */}
      <Spinner size="xl" color="cyan.500" />{' '}
      {/* Use the Spinner component with desired size and color */}
    </Center>
  );
};

export default MySpinner;
