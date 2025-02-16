import { TodoFromBoard } from "@/app/_store/todoStore";

const todoApis = {
  getTodos: async (): Promise<TodoFromBoard[]> => {
    const response = await fetch(`/api/todos`);
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
  }): Promise<TodoFromBoard> => {
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
