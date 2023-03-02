import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/user";
import { Pressable, Text } from "native-base";
import PropTypes from "prop-types";
const RenderItem = (props) => {
  const dispatch = useDispatch();

  const _press = useCallback(() => {
    if (!props.pram) return;
    dispatch(
      updateUser({
        id: props.id,
        changes: {
          [props.pram]: props.item,
        },
      })
    );
    props.navigate("home");
  }, []);

  return (
    <Pressable onPress={_press} p="2" my="2" bg="accent.50" rounded="md">
      <Text px="2" fontSize="lg" fontWeight="700" color="secondary.400">
        {props.item}
      </Text>
    </Pressable>
  );
};
RenderItem.propTypes = {
  id: PropTypes.string.isRequired,
  item: PropTypes.string.isRequired,
  pram: PropTypes.string,
  navigate: PropTypes.func.isRequired,
};
export default memo(RenderItem);
