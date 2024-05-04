import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { Task } from "../utils/Models";

interface TasksContextType {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
}

export const TasksContext = createContext<TasksContextType>({
  tasks: [],
  setTasks: () => {},
});

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TasksContext.Provider>
  );
};
