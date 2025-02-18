import { TodoType } from "./type";

const todoApis = {
  getTodos: async (): Promise<TodoType[]> => {
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
  updateTodo: async ({
    todoId,
    todo,
    isCompleted,
  }: {
    todoId: string;
    todo?: string;
    isCompleted?: boolean;
  }): Promise<TodoType> => {
    const response = await fetch(`/api/todos/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo, isCompleted }),
    });
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Todo must be at least 2 characters");
      }
      throw new Error("Failed to update a todo");
    }
    return response.json();
  },
  removeTodo: async ({ todoId }: { todoId: string }): Promise<TodoType[]> => {
    const response = await fetch(`/api/todos/${todoId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to remove a todo");
    }
    return response.json();
  },
  moveTodoInBoard: async ({
    sourceBoardId,
    sourceIndex,
    destinationIndex,
  }: {
    sourceBoardId: string;
    sourceIndex: number;
    destinationIndex: number;
  }): Promise<TodoType[]> => {
    const response = await fetch(`/api/todos/move/${sourceBoardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sourceIndex, destinationIndex }),
    });
    if (!response.ok) {
      throw new Error("Failed to move a todo");
    }
    return response.json();
  },
  moveTodoBetweenBoards: async ({
    destinationBoardId,
    destinationIndex,
    sourceBoardId,
    sourceIndex,
  }: {
    sourceBoardId: string;
    destinationBoardId: string;
    sourceIndex: number;
    destinationIndex: number;
  }): Promise<TodoType[]> => {
    const response = await fetch(
      `/api/todos/move/${sourceBoardId}/${destinationBoardId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sourceIndex, destinationIndex }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to move a todo");
    }
    return response.json();
  },
};

export default todoApis;
