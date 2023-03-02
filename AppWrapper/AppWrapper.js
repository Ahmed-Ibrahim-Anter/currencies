import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import User from "../screen/User";
import Home from "../screen/Home";
import ListItems from "../screen/ListItems";

/* ------------------------------------ x ----------------------------------- */

/* ------------------------------------ x ----------------------------------- */
const Stack = createStackNavigator();
/* ------------------------------------ x ----------------------------------- */
export default function AppWrapper(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <>
          <Stack.Screen name={"user"} component={User} />
          <Stack.Screen name={"home"} component={Home} />
          <Stack.Screen name={"List"} component={ListItems} />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
