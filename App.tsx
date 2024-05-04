import { NavigationContainer } from "@react-navigation/native";
import { SQLiteProvider } from "expo-sqlite/next";
import { initializeDB } from "./utils/Database";
import { TasksProvider } from "./contexts/TasksContext";
import { Stack } from "./utils/Navigation";
import Home from "./pages/Home";
import TaskForm from "./pages/TaskForm";

export default function App() {
  return (
    <SQLiteProvider databaseName="tasks.db" onInit={initializeDB}>
      <TasksProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ title: "Tasks" }}
            />
            <Stack.Screen
              name="TaskForm"
              component={TaskForm}
              options={{ title: "Task Form" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TasksProvider>
    </SQLiteProvider>
  );
}
