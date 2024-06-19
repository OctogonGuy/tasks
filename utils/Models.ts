export type Task = {
  id: number;
  name: string;
  category: string;
  date: Date;
}

export type ListTask = {
  id: number;
  name: string;
  category: string;
  date: Date;
  list_index: number;
}

export type Category = {
  name: string;
  num_tasks: number;
}