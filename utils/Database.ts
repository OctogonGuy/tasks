import { type SQLiteDatabase } from "expo-sqlite/next";
import {Category, ListTask, Task} from "./Models";

/**
 * Initializes task database if not created
 */
export async function initializeDB(db: SQLiteDatabase) {
  try {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT, date DATE);
    `);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Adds a task to the task list
 * @param db The database
 * @param taskInfo The details of the new task to add
 * @param names The names of any tables to add the task to
 */
export async function addTask(db: SQLiteDatabase, taskInfo: any, ...names: string[]) {
  try {
    await db.runAsync(`
    INSERT INTO tasks 
        (name
            ${taskInfo.category ? ", category" : ""}
            ${taskInfo.date ? ", date" : ""})
    VALUES
        ('${taskInfo.name}'
            ${taskInfo.category ? ", '" + taskInfo.category + "'" : ""}
            ${taskInfo.date ? ", " + taskInfo.date.toISOString().split('T')[0] : ""});`);
    const result = await db.getFirstAsync<any>(`SELECT id FROM tasks WHERE id = (SELECT max(id) FROM tasks);`);
    const id = result.id;
    for (const name of names) {
      await addToListIndexTable(db, name, id);
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * Edits an existing task
 * @param db The database
 * @param id The id number of the task to update
 * @param taskInfo The details of the updated task
 * @returns The newly added task
 */
export async function updateTask(db: SQLiteDatabase, id: number, taskInfo: any) {
  let task: Task | null = null;
  try {
    await db.runAsync(`UPDATE tasks SET name = '${taskInfo.name}' where id = ${id};`);
    await db.runAsync(`UPDATE tasks SET category = '${taskInfo.category}' where id = ${id};`);
    await db.runAsync(`UPDATE tasks SET date = '${taskInfo.date}' where id = ${id};`);
    task = await db.getFirstAsync<Task>(`SELECT * FROM tasks WHERE id = ${id};`);
  } catch (e) {
    console.log(e);
  }
  return task;
}

/**
 * Removes a task from the task list
 * @param db The database
 * @param id The id of the task
 */
export async function removeTask(db: SQLiteDatabase, id: number) {
  try {
    await db.runAsync(`DELETE FROM tasks WHERE id = ${id};`);
    // Remove indexes from list tables
    for await (const table of db.getEachAsync<any>("SELECT * FROM sqlite_master WHERE type='table';")) {
      if (table.name === "tasks") continue;
      if (table) await removeFromListIndexTable(db, table.name.split("_")[0], id);
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * Creates a table that holds the positions of tasks as indexes in a list
 * @param db The database
 * @param name The name of the list
 */
export async function createListIndexTable(db: SQLiteDatabase, name: string) {
  try {
    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS ${name}_list_indexes (task_id INTEGER NOT NULL, list_index INTEGER NOT NULL);`
    );
  } catch (e) {
    console.log(e);
  }
}

/**
 * Adds a task to the given list
 * @param db The database
 * @param name The name of the list
 * @param id The id of the task
 */
export async function addToListIndexTable(db: SQLiteDatabase, name: string, id: number) {
  try {
    const result = await db.getFirstAsync<any>(`SELECT COUNT(*) FROM ${name}_list_indexes;`);
    const size = result["COUNT(*)"];
    await db.runAsync(`INSERT INTO ${name}_list_indexes (task_id, list_index) VALUES (${id}, ${size});`);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Remove a task from the given list
 * @param db The database
 * @param name The name of the list
 * @param id The id of the task
 */
export async function removeFromListIndexTable(db: SQLiteDatabase, name: string, id: number) {
  try {
    let result;
    result = await db.getFirstAsync<any>(`SELECT task_id FROM ${name}_list_indexes where task_id = ${id};`);
    if (!result) return;
    result = await db.getFirstAsync<any>(`SELECT COUNT(*) FROM ${name}_list_indexes;`);
    const size = result["COUNT(*)"];
    result = await db.getFirstAsync<any>(`SELECT list_index FROM ${name}_list_indexes where task_id = ${id};`);
    const index = result.list_index;
    await db.runAsync(`DELETE FROM ${name}_list_indexes WHERE task_id = ${id};`);
    for (let i = index + 1; i < size; i++) {
      await db.runAsync(
        `UPDATE ${name}_list_indexes SET list_index = ${i - 1} where list_index = ${i};`
      );
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * Rearranges task list indexes to account for a task moving.
 * @param db The database
 * @param name The name of the list
 * @param from The index from which a task item was dragged
 * @param to The index to which a task item was dragged
 */
export async function setTaskIndexes(db: SQLiteDatabase, name: string, from: number, to: number) {
  let tasks: Task[] = [];
  await getTasks(db, name, (list) => tasks = tasks.concat(list));
  try {
    const a = Math.min(from, to);
    const b = Math.max(from, to);
    if (from < to) {
      for (let i = a + 1; i <= b; i++) {
        await db.runAsync(
          `UPDATE ${name}_list_indexes SET list_index = ${i - 1} where task_id = ${tasks[i].id};`
        );
      }
    }
    else {
      for (let i = a; i < b; i++) {
        await db.runAsync(
          `UPDATE ${name}_list_indexes SET list_index = ${i + 1} where task_id = ${tasks[i].id};`
        );
      }
    }
    await db.runAsync(
      `UPDATE ${name}_list_indexes SET list_index = ${to} where task_id = ${tasks[from].id};`
    );
  } catch (e) {
    console.log(e);
  }
}

/**
 * Loads the tasks into the context
 * @param db The database
 * @param callback The function to execute using the database contents
 */
export async function getAllTasks(
  db: SQLiteDatabase,
  callback: (tasks: Task[]) => void
) {
  try {
    const result = await db.getAllAsync<Task>("SELECT * FROM tasks;");
    callback(result);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Loads the tasks from a particular list in order into the context
 * @param db The database
 * @param name The name of the task list
 * @param callback The function to execute using the database contents
 */
export async function getTasks(
  db: SQLiteDatabase,
  name: string,
  callback: (tasks: Task[]) => void
) {
  try {
    const result = await db.getAllAsync<ListTask>(`SELECT * FROM tasks INNER JOIN ${name}_list_indexes ON tasks.id = ${name}_list_indexes.task_id;`);
    const listTasks = result.sort((a, b) => a.list_index - b.list_index);
    const tasks: Task[] = [];
    for (const task of listTasks) {
      tasks.push({id: task.id, name: task.name, category: task.category, date: task.date});
    }
    callback(tasks);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Loads the task categories into the context
 * @param db The database
 * @param callback The function to execute using the database contents
 */
export async function getCategories(
  db: SQLiteDatabase,
  callback: (tasks: Category[]) => void
) {
  try {
    const result = await db.getAllAsync<ListTask>(`SELECT * FROM tasks;`);
    const categories: Map<string, Category> = new Map();
    for (const task of result) {
      if (!categories.has(task.category)) {
        categories.set(task.category, {name: task.category, num_tasks: 0});
      }
      categories.get(task.category)!.num_tasks += 1;
    }
    callback(Array.from(categories.values()));
  } catch (e) {
    console.log(e);
  }
}