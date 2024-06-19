import { useSQLiteContext } from "expo-sqlite/next";
import { useContext, useState, useEffect } from "react";
import {View, TextInput, Button, Modal, Text} from "react-native";
import { TasksContext } from "../contexts/TasksContext";
import {updateTask, getAllTasks, addTask, getTasks, getCategories} from "../utils/Database";
import { TaskFormProps } from "../utils/Navigation";
import Styles from "../utils/Styles";
import {Dropdown} from "react-native-element-dropdown";
import {Category} from "../utils/Models";
import RNDateTimePicker from "@react-native-community/datetimepicker";

/**
 * A screen that allows the user to create a new task
 */
export default ({ route, navigation }: TaskFormProps) => {
  const db = useSQLiteContext();
  const { tasks, setTasks } = useContext(TasksContext);
  const [taskName, setTaskName] = useState<string>(
    route.params?.task.name ?? ""
  );
  const [taskCategory, setTaskCategory] = useState<string|undefined>(
    route.params?.task.category ?? undefined
  );
  const [taskDate, setTaskDate] = useState<Date|undefined>(
    route.params?.task.date ?? undefined
  );
  const [validData, setValidData] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");

  // Validate form fields on any change
  useEffect(() => {
    async function loadCategories() {
      await getCategories(db, setCategories);
    }
    loadCategories().then(() => {
      setCategories(categories);
    });
  }, []);

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
        <Modal
          visible={showNewCategoryModal}
          transparent={true}
          animationType="slide"
        >
          <View style={Styles.newCategoryModal}>
            <TextInput
              style={[Styles.textInput, Styles.text]}
              placeholder={"Category name"}
              onChangeText={setCategoryName}
            />
            <View style={Styles.controlGroup}>
              <Button
                title="Create"
                onPress={() => {
                  categories.push({name: categoryName, num_tasks: 0});
                  setShowNewCategoryModal(false);
                  setTaskCategory(categoryName);
                }}
              />
              <Button
                title="Cancel"
                onPress={() => setShowNewCategoryModal(false)}
              />
            </View>
          </View>
        </Modal>
        <TextInput
          style={[Styles.textInput, Styles.text]}
          placeholder={"Task name"}
          onChangeText={setTaskName}
          defaultValue={taskName}
        />
        <View style={Styles.controlGroup}>
          <Text>Category:</Text>
          <Dropdown
            style={Styles.dropdown}
            data={categories!.map(function (category: Category) {
              return { label: category.name, value: category };
            })}
            labelField="label"
            valueField="value"
            placeholder={taskCategory}
            onChange={(item) => {
              setTaskCategory(item.value.name);
            }}
          />
          <Button
            title="New"
            onPress={() => setShowNewCategoryModal(true)}
          />
          <Button
            title="Clear"
            onPress={() => setTaskCategory(undefined)}
          />
        </View>
        <View style={Styles.controlGroup}>
          <Text>Scheduled date: {taskDate?.toString()}</Text>
          <Button
            title="Pick"
            onPress={() => setShowDateTimePicker(true)}
          />
          <Button
            title="Clear"
            onPress={() => setTaskDate(undefined)}
          />
          {showDateTimePicker && <RNDateTimePicker
            mode="date"
            value={taskDate?? new Date()}
            onChange={(e, date) => {
              setShowDateTimePicker(false);
              setTaskDate(date?? new Date());
            }}
          />}
        </View>
      </View>
      <View style={Styles.addTaskButtonContainer}>
        <Button
          title={route.params ? "Edit task" : "Add task"}
          disabled={!validData}
          onPress={async () => {
            if (route.params) {
              // Edit task
              const taskInfo = { name: taskName, category: taskCategory?.toString(), date: taskDate };
              await updateTask(db, route.params.task.id, taskInfo);
              getTasks(db, "home", setTasks);
              navigation.goBack();
            } else {
              // Add task
              const taskInfo = { name: taskName, category: taskCategory?.toString(), date: taskDate };
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
