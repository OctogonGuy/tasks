import { useSQLiteContext } from "expo-sqlite/next";
import { useContext, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Svg, Polygon } from "react-native-svg";
import DraggableFlatList from "react-native-draggable-flatlist";
import { TasksContext } from "../contexts/TasksContext";
import {
  createListIndexTable,
  getAllTasks,
  getTasks,
  removeTask,
  setTaskIndexes,
} from "../utils/Database";
import { HomeProps } from "../utils/Navigation";
import Styles from "../utils/Styles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TaskListItem from "../components/TaskListItem";
import { Task } from "../utils/Models";

/**
 * The screen that shows the tasks
 */
export default ({ route, navigation }: HomeProps) => {
  const db = useSQLiteContext();
  const { tasks, setTasks } = useContext(TasksContext);

  useEffect(() => {
    // Create home list table if not created already
    createListIndexTable(db, "home");
    // Get tasks from database
    getTasks(db, "home", setTasks);
  }, []);

  const renderItem = (item: Task, drag: () => void, isActive: boolean) => {
    return (
      <TaskListItem
        item={item}
        drag={drag}
        isActive={isActive}
        onChecked={() => {
          removeTask(db, item.id);
          getTasks(db, "home", setTasks);
        }}
        onPress={() => navigation.navigate("TaskForm", { task: item })}
      />
    );
  };

  return (
    <View style={Styles.container}>
      <GestureHandlerRootView style={Styles.listContainer}>
        <DraggableFlatList
          style={Styles.list}
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          onDragEnd={({ data, from, to }) => {
            setTaskIndexes(db, "home", from, to);
            // Immediate update
            setTasks(data);
          }}
          renderItem={({ item, drag, isActive }) =>
            renderItem(item, drag, isActive)
          }
          ItemSeparatorComponent={() => <View style={Styles.listSeparator} />}
        />
      </GestureHandlerRootView>
      <View style={Styles.bottomTabs}>
        <TouchableOpacity
          style={Styles.newTaskButton}
          onPress={() => navigation.navigate("TaskForm")}
        >
          <Svg viewBox="0 0 100 100" style={Styles.newTaskButtonSvg}>
            <Polygon
              points="0,42 42,42 42,0 58,0 58,42 100,42 100,58 58,58 58,100 42,100 42,58 0,58"
              fill="black"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};
