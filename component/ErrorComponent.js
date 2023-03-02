import { VStack, Center, Image, Text, Box, StatusBar } from "native-base";
import PropTypes from "prop-types";
const ErrorComponent = (props) => {
  let msg = "some thing went wrong  ";
  return (
    <VStack flex="1">
      <StatusBar
        translucent
        backgroundColor="#ebf8ff"
        barStyle="dark-content"
      />

      <Box safeAreaTop />
      <Center mt="1/4">
        <Image
          h="1/2"
          w="80%"
          resizeMode="contain"
          source={require("../assets/error.png")}
          alt={props.errorMsg || msg}
        />
      </Center>
      <Text alignSelf="center" fontWeight="700" fontSize="lg">
        {props.errorMsg || msg}
      </Text>
    </VStack>
  );
};

ErrorComponent.propTypes = {
  errorMsg: PropTypes.string,
};
export default ErrorComponent;
