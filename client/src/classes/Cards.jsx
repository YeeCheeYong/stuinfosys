import styled from 'styled-components';
import { Box, Button, Flex, chakra } from '@chakra-ui/react';

const TextContainer = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

function Cards(props) {
  const {
    title,
    onDetails,
    subTitle,
    description,
    value,
    isActive = true,
    buttonColor = 'green',
  } = props;
  return (
    <Box
      w="full"
      width={370}
      height={200}
      m={5}
      px={4}
      py={3}
      bg="white"
      _dark={{ bg: 'gray.800' }}
      shadow="0 0 20px rgba(0, 0, 0, 0.6)"
      rounded="md"
      position={'relative'}
    >
      <Box>
        <chakra.h1
          fontSize="lg"
          fontWeight="bold"
          mt={2}
          color="gray.800"
          _dark={{ color: 'white' }}
        >
          {title}
        </chakra.h1>
        <Flex justifyContent="space-between" alignItems="center">
          <chakra.span
            fontSize="sm"
            color="gray.800"
            _dark={{ color: 'gray.400' }}
          >
            {subTitle}
          </chakra.span>
          <chakra.span
            color="brand.800"
            _dark={{ color: 'brand.900' }}
            px={3}
            py={1}
            rounded="full"
            textTransform="uppercase"
            fontSize="xs"
          >
            {value}
          </chakra.span>
        </Flex>
        <TextContainer>
          <chakra.p
            fontSize="sm"
            mt={2}
            color="gray.600"
            _dark={{ color: 'gray.300' }}
          >
            {description}
          </chakra.p>
        </TextContainer>
      </Box>
      <Box position={'absolute'} bottom={3}>
        <Button
          mr={3}
          colorScheme={buttonColor}
          variant="solid"
          size="sm"
          onClick={onDetails}
        >
          details
        </Button>
        {!isActive && (
          <Button colorScheme="red" variant="solid" size="sm">
            Inactive
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default Cards;
