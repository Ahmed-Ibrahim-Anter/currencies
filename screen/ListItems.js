import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelectors } from "../redux/user";
import { Box, FlatList, Icon, Input, StatusBar, VStack } from "native-base";
import { drop, take } from "lodash";
import RenderItem from "../component/RenderItem";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import PropTypes from "prop-types";
/* ------------------------------------ x ----------------------------------- */
const ListItems = ({ route, navigation }) => {
  const regexText = /^[a-zA-Z]{0,3}$/;
  const { pram } = route.params;
  const user = useSelector(userSelectors.selectAll)[0];
  const dispatch = useDispatch();
  const originData = [...user?.keys] || [];
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState(take(originData, 50) || []);
  const loadMore = useCallback(() => {
    if (data.length >= user.keys.length || filteredData.length > 0) return;
    if (user?.keys.length > data.length) {
      const originData = [...user.keys];
      const more = drop(originData, data.length);
      const newData = take(more, 50);
      setData([...data, ...newData]);
    }
  }, [data]);
  const handleSearch = useCallback(
    (text) => {
      if (!regexText.test(text)) {
        Alert.alert("Error-⛔", "only three english letter are allowed");
      }
      setSearchText(text);

      if (text) {
        const newData = originData.filter((item) => {
          const itemData = item.toLowerCase();
          const textData = text.toLowerCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
      } else {
        setFilteredData([]);
      }
    },
    [searchText]
  );
  return (
    <VStack flex="1" p="2" bg="#fff">
      <StatusBar
        translucent
        backgroundColor="#ebf8ff"
        barStyle="dark-content"
      />

      <Box safeAreaTop />
      <VStack space="3" flex="1" px="4">
        <Input
          placeholder="Search"
          variant="filled"
          width="100%"
          borderRadius="10"
          py="1"
          px="2"
          onChangeText={handleSearch}
          value={searchText}
          InputLeftElement={
            <Icon
              ml="2"
              size="4"
              color="gray.400"
              as={<Ionicons name="ios-search" />}
            />
          }
        />
        <FlatList
          data={filteredData.length > 0 ? filteredData : data}
          renderItem={({ item }) => (
            <RenderItem
              pram={pram}
              id={user?.id}
              dispatch={dispatch}
              item={item}
              navigate={navigation.navigate}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          keyExtractor={(item) => "#" + item}
        />
      </VStack>
    </VStack>
  );
};
ListItems.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      pram: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
export default ListItems;
