import { Box } from '@chakra-ui/react';
import React from 'react';

const Layout = (props) => (
    <Box bg="" h="100%" minH="100vh" pl="10%" pr="10%">
        {props.children}
    </Box>
);

export default Layout;
