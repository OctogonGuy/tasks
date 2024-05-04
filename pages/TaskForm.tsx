import { useSQLiteContext } from "expo-sqlite/next";
import { useContext, useState, useEffect } from "react";
import { View, TextInput, Button } from "react-native";
import { TasksContext } from "../contexts/TasksContext";
import { updateTask, getAllTasks, addTask, getTasks } from "../utils/Database";
import { TaskFormProps } from "../utils/Navigation";
import Styles from "../utils/Styles";

/**
 * A screen that allows the user to create a new task
 */
export default ({ route, navigation }: TaskFormProps) => {
  const db = useSQLiteContext();
  const { tasks, setTasks } = useContext(TasksContext);
  const [taskName, setTaskName] = useState<string>(
    route.params?.task.name ?? ""
  );
  const [validData, setValidData] = useState<boolean>(false);

  // Validate form fields on any change
  useEffect(() => {
    validate();
  }, [taskName]);

  // Validate function
  const validate = () => {
    let valid = true;
    if (!taskName) valid = false;
    setValidData(valid);
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.form}>
        <TextInput
          style={[Styles.textInput, Styles.text]}
          placeholder={"Task name"}
          onChangeText={setTaskName}
          defaultValue={taskName}
        />
      </View>
      <View style={Styles.addTaskButtonContainer}>
        <Button
          title={route.params ? "Edit task" : "Add task"}
          disabled={!validData}
          onPress={async () => {
            if (route.params) {
              // Edit task
              const taskInfo = { name: taskName };
              await updateTask(db, route.params.task.id, taskInfo);
              getTasks(db, "home", setTasks);
              navigation.goBack();
            } else {
              // Add task
              const taskInfo = { name: taskName };
              await addTask(db, taskInfo, "home");
              getTasks(db, "home", setTasks);
              navigation.goBack();
            }
          }}
        />
      </View>
    </View>
  );
};
