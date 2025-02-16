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
  }): Promise<TodoFromBoard[]> => {
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
  updateTodo: async ({
    boardId,
    todoId,
    todo,
  }: {
    boardId: string;
    todoId: string;
    todo: string;
  }): Promise<TodoFromBoard[]> => {
    const response = await fetch(`/api/todos/${boardId}/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo }),
    });
    if (!response.ok) {
      throw new Error("Failed to update a todo");
    }
    return response.json();
  },
  removeTodo: async ({
    boardId,
    todoId,
  }: {
    boardId: string;
    todoId: string;
  }): Promise<TodoFromBoard[]> => {
    const response = await fetch(`/api/todos/${boardId}/${todoId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to remove a todo");
    }
    return response.json();
  },
  switchTodo: async ({
    todoId,
    boardId,
    order,
  }: {
    todoId: string;
    boardId: string;
    order: number;
  }): Promise<TodoFromBoard[]> => {
    const response = await fetch(`/api/todos/switch/${boardId}/${todoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order }),
    });
    if (!response.ok) {
      throw new Error("Failed to switch a todo");
    }
    return response.json();
  },
};

export default todoApis;
