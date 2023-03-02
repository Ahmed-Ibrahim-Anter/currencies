import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Center,
  VStack,
  Text,
  HStack,
  Icon,
  Image,
  Box,
  StatusBar,
} from "native-base";
import * as Location from "expo-location";
import CountryFlag from "react-native-country-flag";
import { FontAwesome } from "@expo/vector-icons";
import CountryPicker from "react-native-country-picker-modal";
import { Switch } from "react-native";
import { setUser, updateUser, userSelectors } from "../redux/user";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../api/getData";
import { keys } from "lodash";
import { countries } from "../constants/countries";
import { useQuery } from "react-query";
import ErrorComponent from "../component/ErrorComponent";
import { buttonOption } from "../constants/ButtonOption";
import PropTypes from "prop-types";
/* ------------------------------------ x ----------------------------------- */
const User = (props) => {
  const user = useSelector(userSelectors.selectAll)[0];
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [base, setBase] = useState(null);
  const [notification, setNotification] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();

  const { isLoading, error } = useQuery(
    ["currency", base],
    () => getData(base),
    {
      enabled: !!base,
      onSuccess: (e) => {
        dispatch(
          setUser({
            id: String(Date.now()),
            address: location,
            notification,
            base: e.base,
            keys: [...keys(e.rates)],
            rates: e.base === "SAR" ? e.rates["AED"] : e.rates["SAR"],
            fromCurrency: e.base,
            toCurrency: e.base === "SAR" ? "AED" : "SAR",
            rate: e.base,
          })
        );
      },
      onError: (e) => {
        setErrorMsg(e);
      },
      staleTime: Infinity,
    }
  );

  const onSelect = useCallback(
    (country) => {
      dispatch(
        updateUser({
          id: user.id,
          changes: {
            country,
            countryCode: country.cca2,
          },
        })
      );
      setLocation(country.cca2);
      setBase(country.currency[0]);
    },
    [location]
  );

  useEffect(() => {
    let cancel = false;
    if (cancel || location) return;
    (async () => {
      try {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let address = await Location.reverseGeocodeAsync(location.coords);
        setLocation(address[0].isoCountryCode);
        setBase(countries[address[0].isoCountryCode]?.currency);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setErrorMsg(error);
        console.log("🚀 ~ file: User.js:89 ~ error:", error);
      }
    })();
    return () => (cancel = true);
  }, [!location]);

  /* ------------------------------------ x ----------------------------------- */
  const toggleSwitch = useCallback(() => {
    setNotification(!notification);
    dispatch(
      updateUser({
        id: user.id,
        changes: {
          notification,
        },
      })
    );
  }, [notification]);
  /* ------------------------------------ x ----------------------------------- */
  if (errorMsg || error) {
    return <ErrorComponent errorMsg={errorMsg} />;
  }
  /* ------------------------------------ x ----------------------------------- */
  return (
    <VStack flex="1" bg="#fff">
      <StatusBar
        translucent
        backgroundColor="#ebf8ff"
        barStyle="dark-content"
      />

      <Box safeAreaTop />
      <VStack justifyContent="space-evenly" flex="1">
        <HStack
          alignItems="center"
          justifyContent="space-evenly"
          space={4}
          alignSelf="center"
          w="100%"
        >
          <Icon
            as={FontAwesome}
            name={notification ? "bell-o" : "bell-slash-o"}
            size="xl"
            color="primary.500"
          />
          <Switch
            trackColor={{ false: "#767577", true: "#ed556e" }}
            thumbColor={notification ? "#ebf8ff" : "#f4f3f4"}
            defaultIsChecked
            value={notification}
            onValueChange={toggleSwitch}
          />
        </HStack>
        <Center bg="transparent" alignSelf="center" w="70%" maxH="1/6">
          <Image
            source={require("../assets/pngwing.com.png")}
            alt="logo"
            resizeMode="contain"
            h="100%"
            w="100%"
          />
        </Center>
        <Center>
          <Text my="10" fontWeight="700">
            Country
          </Text>
          <CountryFlag
            isoCode={String(location).toLowerCase() || "de"}
            size={50}
          />
        </Center>

        <Center
          borderWidth=".5"
          w="70%"
          alignSelf="center"
          p="2"
          rounded="sm"
          bg="accent.50"
          overflow="hidden"
        >
          <CountryPicker
            withEmoji
            withModal
            onSelect={onSelect}
            visible={false}
          />
        </Center>

        <Button
          w="70%"
          {...buttonOption}
          isLoading={isLoading || loading}
          isDisabled={isLoading || loading}
          alignSelf="center"
          onPress={() => {
            if (user) {
              props.navigation.navigate("home");
            } else {
              setErrorMsg("some thing went wrong");
            }
          }}
        >
          Skip
        </Button>
      </VStack>
    </VStack>
  );
};
User.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
export default User;
