import { http, HttpResponse } from "msw";
import {
  AddTodoRequestBody,
  DeleteTodoParams,
  EmptyType,
  SwitchTodoParams,
  SwitchTodoRequestBody,
  TodoFromBoardParam,
  UpdateTodoParams,
  UpdateTodoRequestBody,
} from "./type";
import { handleStorage } from "@/app/_utils";

export const todoHandlers = [
  http.get("/api/todos", () => {
    const curTodo = handleStorage.get("todo-storage");
    return HttpResponse.json(curTodo, {
      status: 200,
      statusText: "Get Successfully",
    });
  }),
  http.post<TodoFromBoardParam, AddTodoRequestBody, EmptyType>(
    "/api/todos/:boardId",
    async ({ params, request }) => {
      const { boardId } = params;
      const { todo } = await request.json();

      const curTodo = handleStorage.get("todo-storage");
      if (todo.length > 15 || todo.trim().length < 2) {
        return HttpResponse.json(null, {
          status: 400,
          statusText:
            "Title is too short or too long. Please check your request.",
        });
      }

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
            order: newTodoId,
          },
        ],
      };

      handleStorage.set("todo-storage", [...updateCurTodo, newTodo]);

      return HttpResponse.json([...updateCurTodo, newTodo], {
        status: 200,
        statusText: "Create Successfully",
      });
    }
  ),
  http.put<UpdateTodoParams, UpdateTodoRequestBody, EmptyType>(
    "/api/todos/:boardId/:todoId",
    async ({ params, request }) => {
      const { boardId, todoId } = params;
      const { todo, isCompleted } = await request.json();

      const curTodo = handleStorage.get("todo-storage");
      if (todo && todo.trim().length < 2) {
        return HttpResponse.json(curTodo, {
          status: 400,
          statusText: "Todo must be at least 2 characters",
        });
      }
      const targetTodoList = curTodo.find(
        (board: { boardId: string }) => board.boardId === boardId
      );
      const targetTodo = targetTodoList.todos.find(
        (todo: { id: string }) => todo.id === todoId
      );
      const targetTodoIndex = targetTodoList.todos.findIndex(
        (todo: { id: string }) => todo.id === todoId
      );

      if (isCompleted !== undefined) {
        targetTodo.isCompleted = isCompleted;
      } else {
        targetTodo.todo = todo;
      }

      targetTodoList.todos[targetTodoIndex] = targetTodo;

      const updateTodoList = {
        ...targetTodoList,
      };

      const filterCurTodo = curTodo.filter(
        (board: { boardId: string }) => board.boardId !== boardId
      );

      handleStorage.set("todo-storage", [...filterCurTodo, updateTodoList]);

      return HttpResponse.json([...filterCurTodo, updateTodoList], {
        status: 200,
        statusText: "Update Successfully",
      });
    }
  ),
  http.delete<DeleteTodoParams, EmptyType, EmptyType>(
    "/api/todos/:boardId/:todoId",
    async ({ params }) => {
      const { boardId, todoId } = params;

      const curTodo = handleStorage.get("todo-storage");
      const targetTodoList = curTodo.find(
        (board: { boardId: string }) => board.boardId === boardId
      );
      const targetTodo = targetTodoList.todos.filter(
        (todo: { id: string }) => todo.id !== todoId
      );

      const deleteTargetTodoInCurTodo = {
        ...targetTodoList,
        todos: targetTodo,
      };
      const filterCurTodo = curTodo.filter(
        (board: { boardId: string }) => board.boardId !== boardId
      );

      handleStorage.set("todo-storage", [
        ...filterCurTodo,
        deleteTargetTodoInCurTodo,
      ]);
      return HttpResponse.json([...filterCurTodo, deleteTargetTodoInCurTodo], {
        status: 200,
        statusText: "Delete Successfully",
      });
    }
  ),
  http.patch<SwitchTodoParams, SwitchTodoRequestBody, EmptyType>(
    "/api/todos/switch/:boardId/:todoId",
    async ({ params, request }) => {
      const { boardId, todoId } = params;
      const { order } = await request.json();

      const curTodo = handleStorage.get("todo-storage");
      const targetTodoList = curTodo.find(
        (board: { boardId: string }) => board.boardId === boardId
      );
      const startTodoIndex = targetTodoList.todos.findIndex(
        (todo: { id: string }) => todo.id === todoId
      );
      const endTodoIndex = targetTodoList.todos.findIndex(
        (todo: { order: number }) => todo.order === order
      );

      if (startTodoIndex !== -1 && endTodoIndex !== -1) {
        const temp = targetTodoList.todos[startTodoIndex];
        targetTodoList.todos[startTodoIndex] =
          targetTodoList.todos[endTodoIndex];
        targetTodoList.todos[endTodoIndex] = temp;

        targetTodoList.todos[startTodoIndex].order = order;
        targetTodoList.todos[endTodoIndex].order = temp.order;
      }

      const filterCurTodo = curTodo.filter(
        (board: { boardId: string }) => board.boardId !== boardId
      );

      handleStorage.set("todo-storage", [...filterCurTodo, targetTodoList]);

      return HttpResponse.json([...filterCurTodo, targetTodoList], {
        status: 200,
        statusText: "Switch Successfully",
      });
    }
  ),

  //보드간 todo 위치 변경
];
