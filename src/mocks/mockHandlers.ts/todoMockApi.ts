import { http, HttpResponse } from "msw";
import {
  AddTodoRequestBody,
  DeleteTodoParams,
  EmptyType,
  SwitchTodoParams,
  SwitchTodoRequestBody,
  TodoFromBoardParam,
  TodoInfoType,
  UpdateTodoParams,
  UpdateTodoRequestBody,
} from "./type";
import { handleStorage } from "@/app/_utils";

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

      if (todo.length > 15 || todo.trim().length < 2) {
        return HttpResponse.json(null, {
          status: 400,
          statusText:
            "Title is too short or too long. Please check your request.",
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

      if (todo !== undefined && todo.trim().length < 2) {
        return HttpResponse.json(curTodo, {
          status: 400,
          statusText: "Todo must be at least 2 characters",
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
  http.patch<SwitchTodoParams, SwitchTodoRequestBody, EmptyType>(
    "/api/todos/move/:boardId/:id",
    async ({ params, request }) => {
      const { id, boardId } = params;
      const { order } = await request.json();

      const curTodo = handleStorage.get("todo-storage");
      const targetTodo = curTodo.find((todo: TodoInfoType) => todo.id === id);
      console.log(targetTodo);

      console.log("mock", id, boardId, order, targetTodo.boardId);
      if (targetTodo.boardId !== boardId) {
        targetTodo.boardId = boardId;
      }

      const startTodoIndex = curTodo.findIndex(
        (todo: TodoInfoType) => todo.id === id
      );

      if (startTodoIndex !== -1) {
        const [movedTodo] = curTodo.splice(startTodoIndex, 1); // startIndex 요소 제거
        movedTodo.order = order;

        // order 위치에 요소 삽입
        curTodo.splice(order - 1, 0, movedTodo);

        // 나머지 요소들의 order 값 업데이트
        const boardTodos = curTodo.filter(
          (todo: TodoInfoType) => todo.boardId === boardId
        );

        boardTodos.forEach((todo: TodoInfoType, index: number) => {
          todo.order = index + 1;
        });

        handleStorage.set("todo-storage", curTodo);

        return HttpResponse.json(curTodo, {
          status: 200,
          statusText: "Switch Successfully",
        });
      } else {
        return HttpResponse.json(null, {
          status: 404,
          statusText: "Todo not found",
        });
      }
    }
  ),
];
