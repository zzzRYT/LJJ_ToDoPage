import { TodoListReturn, TodoType } from "./type";

const todoApis = {
  getTodos: async (boardId: string): Promise<TodoListReturn> => {
    const response = await fetch(`/api/todos/${boardId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }
    return response.json();
  },

  addTodo: async ({
    boardId,
    todo,
  }: {
    boardId: string;
    todo: string;
  }): Promise<TodoType> => {
    const response = await fetch(`/api/todos/${boardId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo }),
    });

    if (!response.ok) {
      throw new Error("Failed to add a new todo");
    }
    return response.json();
  },
};

export default todoApis;
