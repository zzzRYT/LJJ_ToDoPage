import { http, HttpResponse } from "msw";
import {
  AddBoardRequestBody,
  BoardInfoType,
  DeleteBoardParams,
  EditBoardParams,
  EditBoardRequestBody,
  EmptyType,
  SwitchBoardParams,
  SwitchBoardRequestBody,
} from "./type";
import { handleStorage } from "@/app/_utils";

export const boardHandlers = [
  //보드 조회
  http.get("/api/boards", async () => {
    const boards = JSON.parse(
      window.localStorage.getItem("board-storage") || "[]"
    );

    if (!boards) {
      return HttpResponse.json(null, {
        status: 404,
        statusText: "Not Found",
      });
    }

    return HttpResponse.json(boards, {
      status: 200,
      statusText: "Get Successfully",
    });
  }),

  // POST 새로운 보드 생성
  http.post<EmptyType, AddBoardRequestBody, EmptyType>(
    "/api/new/board",
    async ({ request }) => {
      const { title } = await request.json();

      const curBoard = handleStorage.get("board-storage");
      const maxOrder =
        curBoard.length > 0
          ? Math.max(...curBoard.map((b: BoardInfoType) => b.order))
          : 0;
      const newBoardId = (Math.random() * 10000).toFixed().toString() + "01";
      const newBoard = {
        id: newBoardId,
        title: title,
        order: maxOrder + 1,
      };

      if (title.length > 15 || title.trim().length < 1) {
        return HttpResponse.json(null, {
          status: 400,
          statusText:
            "Title is too short or too long. Please check your request",
        });
      }

      handleStorage.set("board-storage", [...curBoard, newBoard]);

      if (!title || title === undefined || title === "") {
        return HttpResponse.json(null, {
          status: 400,
          statusText: "Invalid request parameter. Please check your request.",
        });
      }

      return HttpResponse.json(newBoard, {
        status: 201,
        statusText: "Created Successfully",
      });
    }
  ),

  http.patch<EditBoardParams, EditBoardRequestBody, EmptyType>(
    "/api/board/:id",
    async ({ params, request }) => {
      const { id } = params;
      const { title } = await request.json();

      if (title.length > 15 || title.length < 1) {
        return HttpResponse.json(null, {
          status: 400,
          statusText:
            "Title is too short or too long. Please check your request.",
        });
      }

      const boards = handleStorage.get("board-storage");

      const findBoard = boards.find((board: { id: string }) => board.id === id);
      findBoard.title = title;

      handleStorage.set("board-storage", boards);
      return HttpResponse.json(findBoard, {
        status: 200,
        statusText: "Updated Successfully",
      });
    }
  ),

  http.delete<DeleteBoardParams, EmptyType, EmptyType>(
    "/api/board/:id",
    async ({ params }) => {
      const { id } = params;

      if (!id) {
        return HttpResponse.json(null, {
          status: 400,
          statusText: "Invalid request parameter. Please check your request.",
        });
      }

      const boards = handleStorage.get("board-storage");
      const todos = handleStorage.get("todo-storage");

      const removeBoard = boards.filter(
        (board: { id: string }) => board.id !== id
      );

      const remoteTodoFromBoard = todos.filter(
        ({ boardId }: { boardId: string }) => boardId !== id
      );

      handleStorage.set("board-storage", removeBoard);
      handleStorage.set("todo-storage", remoteTodoFromBoard);

      return HttpResponse.json(removeBoard, {
        status: 200,
        statusText: "Deleted Successfully",
      });
    }
  ),

  http.patch<SwitchBoardParams, SwitchBoardRequestBody, EmptyType>(
    "/api/board/move/:id",
    async ({ params, request }) => {
      const { id } = params;
      const { order } = await request.json();

      const boards = handleStorage.get("board-storage");

      const startBoardIndex = boards.findIndex(
        (board: { id: string }) => board.id === id
      );

      if (startBoardIndex !== -1) {
        const [movedBoard] = boards.splice(startBoardIndex, 1); // startIndex 요소 제거
        movedBoard.order = order;

        // order 위치에 요소 삽입
        boards.splice(order - 1, 0, movedBoard);

        // 나머지 요소들의 order 값 업데이트
        boards.forEach((board: BoardInfoType, index: number) => {
          board.order = index + 1;
        });

        handleStorage.set("board-storage", boards);

        return HttpResponse.json(boards, {
          status: 200,
          statusText: "Switched Successfully",
        });
      } else {
        return HttpResponse.json(null, {
          status: 404,
          statusText: "Board not found",
        });
      }
    }
  ),
];
