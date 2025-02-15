import { http, HttpResponse } from "msw";
import { AddTodoRequestBody, EmptyType, TodoFromBoardParam } from "./type";
import { handleStorage } from "@/app/_utils";

export const todoHandlers = [
  http.get<TodoFromBoardParam, EmptyType, EmptyType>(
    "/api/todos/:boardId",
    async ({ params }) => {
      const { boardId } = params;
      const curTodo = handleStorage.get("todo-storage");
      const todos = curTodo.find(
        (board: { boardId: string }) => board.boardId === boardId
      );
      return HttpResponse.json(todos, {
        status: 200,
        statusText: "Get Successfully",
      });
    }
  ),
  http.post<TodoFromBoardParam, AddTodoRequestBody, EmptyType>(
    "/api/todos/:boardId",
    async ({ params, request }) => {
      const { boardId } = params;
      const { todo } = await request.json();

      const curTodo = handleStorage.get("todo-storage");
      const targetTodo = curTodo.find(
        (board: { boardId: string }) => board.boardId === boardId
      );
      const updateCurTodo = curTodo.filter(
        (boardId: { boardId: string }) => boardId.boardId !== targetTodo.boardId
      );
      const newTodoId = (Math.random() * 10000).toFixed().toString() + "02";
      const newTodo = {
        ...targetTodo,
        todos: [
          ...targetTodo.todos,
          {
            id: newTodoId,
            todo: todo,
            isCompleted: false,
            order: targetTodo.todos.length + 1,
          },
        ],
      };

      handleStorage.set("todo-storage", [...updateCurTodo, newTodo]);

      return HttpResponse.json(newTodo, {
        status: 200,
        statusText: "Create Successfully",
      });
    }
  ),
];
