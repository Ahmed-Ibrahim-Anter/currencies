import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Icon,
  StatusBar,
  Text,
  VStack,
  Pressable,
  Input,
  Center,
} from "native-base";
import { pickBy, keys, values, map, flatMap } from "lodash";
import { countries } from "../constants/countries";
import { FontAwesome } from "@expo/vector-icons";
import { updateUser, userSelectors } from "../redux/user";
import { useDispatch, useSelector } from "react-redux";
import { getRateTime } from "../api/getRateTime";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { getConvert } from "../api/getConvert";
import ErrorComponent from "../component/ErrorComponent";
import { buttonOption } from "../constants/ButtonOption";
import {
  dataOne,
  fiveYears,
  oneDay,
  oneMonth,
  oneYear,
  threeMonth,
} from "../api/helper";
import CurrencyButton from "../component/CurrencyButton";
import PropTypes from "prop-types";
/* -------------------------------------------------------------------------- */
/*                                      x                                     */
/* -------------------------------------------------------------------------- */
const Home = (props) => {
  const user = useSelector(userSelectors.selectAll)[0];
  useQuery(
    ["rate", user?.fromCurrency, user?.toCurrency],
    () => getConvert(user?.fromCurrency, user?.toCurrency),
    {
      onSuccess: (e) => {
        dispatch(
          updateUser({
            id: user.id,
            changes: {
              rates: e.result,
            },
          })
        );
      },

      onError: (e) => {
        setErrorMsg(e);
      },

      enabled: !!user,
    }
  );
  const dispatch = useDispatch();
  const numRegex = /^[1-9]\d*(\.\d+)?$/;
  const [errorMsg, setErrorMsg] = useState(null);
  const [amount, setAmount] = useState(1);
  const [start, setStart] = useState(oneDay);
  const [end] = useState(dayjs().format("YYYY-MM-DD"));

  const { isLoading, error, data } = useQuery(
    ["time", start, end, user?.fromCurrency, user?.toCurrency],
    () => getRateTime(start, end, user?.fromCurrency, user?.toCurrency),
    {
      enabled: !!user,
    }
  );

  /* ------------------------------------ x ----------------------------------- */
  const flagFrom = useMemo(
    () => keys(pickBy(countries, (e) => e.currency === user?.fromCurrency))[0],
    [user]
  );
  /* ------------------------------------ x ----------------------------------- */
  const flagTo = useMemo(
    () => keys(pickBy(countries, (e) => e.currency === user?.toCurrency))[0],
    [user]
  );
  /* ------------------------------------ x ----------------------------------- */
  ////const chartX = useMemo(() => keys(data?.rates), [data]);
  /* ------------------------------------ x ----------------------------------- */

  const chartY = useMemo(
    () =>
      flatMap(
        map(
          values(
            data?.rates || {
              "2023-02-28": { SAR: 0.029465 },
            }
          ),
          (n) => values(n)
        )
      ),
    [data, user]
  );

  /* ------------------------------------ x ----------------------------------- */

  /* ------------------------------------ x ----------------------------------- */
  const onChangeText = useCallback((n) => setAmount(n), [amount]);
  /* ------------------------------------ x ----------------------------------- */
  const pressTime = useCallback(
    (time) => {
      setStart(time);
    },
    [start]
  );

  /* ------------------------------------ x ----------------------------------- */
  /* ------------------------------------ x ----------------------------------- */
  if (errorMsg || error) {
    return <ErrorComponent errorMsg={errorMsg} />;
  }

  /* ------------------------------------ x ----------------------------------- */
  return (
    <VStack flex="1" p="2" bg="accent.50:alpha.20">
      <StatusBar
        translucent
        backgroundColor="#ebf8ff"
        barStyle="dark-content"
      />

      <Box safeAreaTop />
      <VStack space="3" flex="1">
        <VStack
          h="49%"
          bg="#fff"
          rounded="lg"
          justifyContent="space-evenly"
          px="2"
        >
          <HStack justifyContent="space-around" alignItems="center">
            <CurrencyButton
              navigate={props.navigation.navigate}
              flag={flagTo}
              text={user?.toCurrency}
              pram="toCurrency"
              rates={String(user?.rates)}
            />
            <Pressable
              onPress={() => {
                dispatch(
                  updateUser({
                    id: user.id,
                    changes: {
                      fromCurrency: user?.toCurrency,
                      toCurrency: user?.fromCurrency,
                    },
                  })
                );
              }}
              p="4"
            >
              <Icon
                as={FontAwesome}
                name="exchange"
                size="lg"
                color="primary.500"
              />
            </Pressable>

            <CurrencyButton
              navigate={props.navigation.navigate}
              flag={flagFrom}
              text={user?.fromCurrency}
              pram="fromCurrency"
              rates={String(user?.rates)}
            />
          </HStack>
          <Center>
            <Input
              w="40%"
              bg="secondary.50"
              variant="outline"
              fontWeight="700"
              borderWidth="1"
              textAlign="center"
              placeholderTextColor={"gray.400"}
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              type="text"
              isRequired
              onBlur={() => !numRegex.test(amount) && setAmount(1)}
              //isDisabled={props.isReadOnly}
              keyboardType="numeric"
              value={String(amount)}
              onChangeText={onChangeText}
            />
          </Center>
          <VStack
            alignSelf="center"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              fontWeight="700"
              fontSize="xl"
              letterSpacing="2xl"
              color="primary.400"
            >
              {(Number(user?.rates) * Number(amount)).toFixed(3)}
            </Text>
            <Text fontSize="sm" color="gray.400">
              {user?.toCurrency}
            </Text>
          </VStack>
        </VStack>
        <VStack h="49%" bg="#fff" rounded="lg" justifyContent="space-evenly">
          <LineChart
            data={{
              datasets: [
                {
                  data: chartY || [0.122533, 0.122517],
                },
                {
                  data: [chartY[0]], // min
                },
                {
                  data: [chartY[chartY?.length - 1]], // max
                },
              ],
            }}
            width={Dimensions.get("window").width * 0.95} // from react-native
            height={250}
            yAxisInterval={0.2} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#ffdbe1",
              backgroundGradientFrom: "#ffdbe1",
              backgroundGradientTo: "#f3647b",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255,240, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "1",
                strokeWidth: "2",
                stroke: "#ebf8ff",
              },
            }}
            bezier
            style={{
              marginVertical: 4,
              borderRadius: 16,
            }}
          />
          <HStack justifyContent="space-evenly">
            <Button
              {...buttonOption}
              isLoading={isLoading && start === fiveYears}
              isDisabled={isLoading}
              w="1/6"
              bg={dataOne(start === fiveYears, "primary.200", "primary.500")}
              onPress={() => pressTime(fiveYears)}
            >
              5Y
            </Button>
            <Button
              {...buttonOption}
              isLoading={isLoading && start === oneYear}
              isDisabled={isLoading}
              w="1/6"
              bg={dataOne(start === oneYear, "primary.200", "primary.500")}
              onPress={() => pressTime(oneYear)}
            >
              1Y
            </Button>
            <Button
              {...buttonOption}
              isLoading={isLoading && start === threeMonth}
              isDisabled={isLoading}
              w="1/6"
              bg={dataOne(start === threeMonth, "primary.200", "primary.500")}
              onPress={() => pressTime(threeMonth)}
            >
              3M
            </Button>
            <Button
              {...buttonOption}
              isLoading={isLoading && start === oneMonth}
              isDisabled={isLoading}
              w="1/6"
              bg={dataOne(start === oneMonth, "primary.200", "primary.500")}
              onPress={() => pressTime(oneMonth)}
            >
              1M
            </Button>
            <Button
              {...buttonOption}
              isLoading={isLoading && start === oneDay}
              isDisabled={isLoading}
              w="1/6"
              bg={dataOne(start === oneDay, "primary.200", "primary.500")}
              onPress={() => pressTime(oneDay)}
            >
              1D
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
};
Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
export default Home;
