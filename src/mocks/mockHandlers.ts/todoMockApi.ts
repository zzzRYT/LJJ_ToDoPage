import { http, HttpResponse } from "msw";
import {
  AddTodoRequestBody,
  DeleteTodoParams,
  EmptyType,
  MoveTodoBetweenBoardsRequestBody,
  MoveTodoInBoardRequestBody,
  MoveTodoParams,
  TodoFromBoardParam,
  TodoInfoType,
  UpdateTodoParams,
  UpdateTodoRequestBody,
} from "./type";
import { handleStorage } from "@/app/_utils";
import { TodoType } from "@/app/_features/board/todo/type";

export const todoHandlers = [
  //todo 조회 controller
  http.get<TodoFromBoardParam, EmptyType, EmptyType>("/api/todos", () => {
    const curTodo = handleStorage.get("todo-storage");

    return HttpResponse.json(curTodo, {
      status: 200,
      statusText: "Get Successfully",
    });
  }),
  //todo 추가 controller
  http.post<TodoFromBoardParam, AddTodoRequestBody, EmptyType>(
    "/api/todos/:boardId",
    async ({ params, request }) => {
      const { boardId } = params;
      const { todo } = await request.json();

      const curTodo = handleStorage.get("todo-storage");

      if (todo.trim().length < 1) {
        return HttpResponse.json(null, {
          status: 400,
          statusText: "Todo must be at least 1 characters",
        });
      }

      const boardTodos = curTodo.filter(
        (t: TodoInfoType) => t.boardId === boardId
      );
      const maxOrder =
        boardTodos.length > 0
          ? Math.max(...boardTodos.map((t: TodoInfoType) => t.order))
          : 0;
      const newTodoId = (Math.random() * 10000).toFixed().toString() + "02";
      const newTodo = {
        boardId: boardId,
        id: newTodoId,
        todo: todo,
        isCompleted: false,
        order: maxOrder + 1,
      };

      handleStorage.set("todo-storage", [...curTodo, newTodo]);

      return HttpResponse.json(newTodo, {
        status: 200,
        statusText: "Create Successfully",
      });
    }
  ),
  http.put<UpdateTodoParams, UpdateTodoRequestBody, EmptyType>(
    "/api/todos/:id",
    async ({ params, request }) => {
      const { id } = params;
      const { todo, isCompleted } = await request.json();

      const curTodo = handleStorage.get("todo-storage");

      if (todo !== undefined && todo.trim().length < 1) {
        return HttpResponse.json(curTodo, {
          status: 400,
          statusText: "Todo must be at least 1 characters",
        });
      }
      const targetTodo = curTodo.find((todo: TodoInfoType) => todo.id === id);
      if (todo) {
        targetTodo.todo = todo;
      } else {
        targetTodo.isCompleted = isCompleted;
      }

      handleStorage.set("todo-storage", curTodo);

      return HttpResponse.json(targetTodo, {
        status: 200,
        statusText: "Update Successfully",
      });
    }
  ),
  http.delete<DeleteTodoParams, EmptyType, EmptyType>(
    "/api/todos/:id",
    async ({ params }) => {
      const { id } = params;

      const curTodo = handleStorage.get("todo-storage");
      const targetDeletedTodo = curTodo.filter(
        (todo: TodoInfoType) => todo.id !== id
      );

      handleStorage.set("todo-storage", targetDeletedTodo);
      return HttpResponse.json(targetDeletedTodo, {
        status: 200,
        statusText: "Delete Successfully",
      });
    }
  ),
  http.patch<MoveTodoParams, MoveTodoInBoardRequestBody, EmptyType>(
    "/api/todos/move/:sourceBoardId",
    async ({ params, request }) => {
      const { sourceBoardId } = params;
      const { sourceIndex, destinationIndex } = await request.json();

      if (sourceIndex < 0 || destinationIndex < 0) {
        return HttpResponse.json(null, {
          status: 400,
          statusText: "Invalid request parameter. Please check your request.",
        });
      }

      const curTodos = handleStorage.get("todo-storage");
      const moveTodos = curTodos
        .filter((t: TodoType) => t.boardId === sourceBoardId)
        .sort((a: TodoType, b: TodoType) => a.order - b.order);
      const [movedTodo] = moveTodos.splice(sourceIndex, 1);
      moveTodos.splice(destinationIndex, 0, movedTodo);
      moveTodos.forEach((todo: TodoType, i: number) => {
        todo.order = i + 1;
      });
      //보드 교체
      const newTodos = curTodos.map((todo: TodoType) =>
        todo.boardId === sourceBoardId
          ? moveTodos.find((t: TodoType) => t.id === todo.id) || todo
          : todo
      );

      handleStorage.set("todo-storage", newTodos);
      return HttpResponse.json(newTodos, {
        status: 200,
        statusText: "Move Successfully",
      });
    }
  ),
  http.patch<MoveTodoParams, MoveTodoBetweenBoardsRequestBody, EmptyType>(
    "/api/todos/move/:sourceBoardId/:destinationBoardId",
    async ({ params, request }) => {
      const { sourceBoardId, destinationBoardId } = params;
      const { sourceIndex, destinationIndex } = await request.json();

      if (sourceIndex < 0 || destinationIndex < 0) {
        return HttpResponse.json(null, {
          status: 400,
          statusText: "Invalid request parameter. Please check your request.",
        });
      }

      //기존 todo
      const curTodos = handleStorage.get("todo-storage");
      //시작 todo
      const sourceTodos = curTodos
        .filter((t: TodoType) => t.boardId === sourceBoardId)
        .sort((a: TodoType, b: TodoType) => a.order - b.order);
      //drop todo
      const destinationTodos = curTodos
        .filter((t: TodoType) => t.boardId === destinationBoardId)
        .sort((a: TodoType, b: TodoType) => a.order - b.order);

      if (sourceIndex < 0 || sourceIndex >= sourceTodos.length) {
        return HttpResponse.json(null, {
          status: 400,
          statusText: "Invalid request parameter. Please check your request.",
        });
      }

      const [movedTodo] = sourceTodos.splice(sourceIndex, 1);
      movedTodo.boardId = destinationBoardId;
      destinationTodos.splice(destinationIndex, 0, movedTodo);
      sourceTodos.forEach((todo: TodoType, i: number) => (todo.order = i + 1));
      destinationTodos.forEach(
        (todo: TodoType, i: number) => (todo.order = i + 1)
      );
      const otherTodos = curTodos.filter(
        (t: TodoType) =>
          t.boardId !== sourceBoardId && t.boardId !== destinationBoardId
      );

      handleStorage.set("todo-storage", [
        ...otherTodos,
        ...sourceTodos,
        ...destinationTodos,
      ]);

      return HttpResponse.json(
        [...otherTodos, ...sourceTodos, ...destinationTodos],
        {
          status: 200,
          statusText: "Move Successfully",
        }
      );
    }
  ),
];
