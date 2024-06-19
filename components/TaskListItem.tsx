import {
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import CheckBox from "./CheckBox";
import Styles from "../utils/Styles";
import { Task } from "../utils/Models";

export type TaskListItemParamList = {
  item: Task;
  drag: () => void;
  isActive: boolean;
  onChecked: () => void;
  onPress: () => void;
};
export default ({
  item,
  drag,
  isActive,
  onChecked,
  onPress,
}: TaskListItemParamList) => {
  return (
    <TouchableOpacity
      style={Styles.listItem}
      onPress={onPress}
      disabled={isActive}
      onLongPress={drag}
    >
      <View style={Styles.listItemContent}>
        <CheckBox style={Styles.listItemCheckBox} onChecked={onChecked} />
        <Text style={Styles.text}>{item.name}</Text>
        <Text style={Styles.text}>{item.category}</Text>
        <Text style={Styles.text}>{item.date?.toString()}</Text>
      </View>
      <TouchableWithoutFeedback onPressIn={drag}>
        <Svg viewBox="0 0 100 100" style={Styles.listItemDragButton}>
          <Rect y="15" width="100" height="10" fill="black" />
          <Rect y="45" width="100" height="10" fill="black" />
          <Rect y="75" width="100" height="10" fill="black" />
        </Svg>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  );
};
