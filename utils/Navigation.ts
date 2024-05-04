import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Task } from "./Models";

export type RootStackParamList = {
  Home: undefined;
  TaskForm: { task: Task } | undefined;
};

export const Stack = createNativeStackNavigator<RootStackParamList>();
export type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type TaskFormProps = NativeStackScreenProps<RootStackParamList, "TaskForm">;