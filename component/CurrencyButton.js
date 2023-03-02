import React from "react";
import { Box, HStack, Text, Pressable } from "native-base";
import CountryFlag from "react-native-country-flag";
import PropTypes from "prop-types";

export default class CurrencyButton extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    flag: PropTypes.string,
    pram: PropTypes.string.isRequired,
    rates: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.rates !== this.props.rates;
  }
  render() {
    return (
      <Pressable
        w="30%"
        bg="accent.50"
        py="3"
        rounded="lg"
        onPress={() => {
          this.props.navigate("List", {
            pram: this.props.pram,
          });
        }}
      >
        <HStack justifyContent="space-evenly" alignItems="center">
          <Text fontWeight="700" fontSize="lg">
            {this.props.text}
          </Text>
          <Box>
            <CountryFlag
              isoCode={
                this.props.flag ? String(this.props.flag).toLowerCase() : "eg"
              }
              size={20}
            />
          </Box>
        </HStack>
      </Pressable>
    );
  }
}
