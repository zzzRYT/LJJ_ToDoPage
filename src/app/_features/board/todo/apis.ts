import { toast } from "react-toastify";
import {
  AddTodoParams,
  EditTodoParams,
  moveTodoBetweenBoardsParams,
  MoveTodoInBoardParams,
  RemoveTodoParams,
  TodoType,
} from "./type";

const todoApis = {
  getTodos: async (): Promise<TodoType[]> => {
    const response = await fetch(`/api/todos`);
    if (!response.ok) {
      toast.error("데이터를 불러오는데 실패했습니다. 다시 시도해 주세요.");
    }
    return response.json();
  },

  addTodo: async ({ boardId, todo }: AddTodoParams): Promise<TodoType> => {
    const response = await fetch(`/api/todos/${boardId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo }),
    });

    if (!response.ok) {
      toast.error("추가에 실패했습니다. 다시 시도해 주세요.");
    }
    return response.json();
  },
  updateTodo: async ({
    id,
    todo,
    isCompleted,
  }: EditTodoParams): Promise<TodoType> => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo, isCompleted }),
    });
    if (!response.ok) {
      if (response.status === 400) {
        toast.error("Todo의 길이는 1자 이상이어야 합니다.");
      }
    }
    return response.json();
  },
  removeTodo: async ({ id }: RemoveTodoParams): Promise<TodoType[]> => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      toast.error("삭제에 실패했습니다. 다시 시도해 주세요.");
    }
    return response.json();
  },
  moveTodoInBoard: async ({
    sourceBoardId,
    sourceIndex,
    destinationIndex,
  }: MoveTodoInBoardParams): Promise<TodoType[]> => {
    const response = await fetch(`/api/todos/move/${sourceBoardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sourceIndex, destinationIndex }),
    });
    if (!response.ok) {
      toast.error("위치 이동을 실패했습니다. 다시 시도해 주세요.");
    }
    return response.json();
  },
  moveTodoBetweenBoards: async ({
    destinationBoardId,
    destinationIndex,
    sourceBoardId,
    sourceIndex,
  }: moveTodoBetweenBoardsParams): Promise<TodoType[]> => {
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
      toast.error("위치 이동을 실패했습니다. 다시 시도해 주세요.");
    }
    return response.json();
  },
};

export default todoApis;
