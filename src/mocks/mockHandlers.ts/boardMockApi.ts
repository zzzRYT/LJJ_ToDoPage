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

      const targetBoard = boards.find(
        (board: BoardInfoType) => board.id === id
      );

      const removeBoard = boards.filter(
        (board: { id: string }) => board.id !== id
      );

      const remoteTodoFromBoard = todos.filter(
        ({ boardId }: { boardId: string }) => boardId !== id
      );

      handleStorage.set("board-storage", removeBoard);
      handleStorage.set("todo-storage", remoteTodoFromBoard);

      return HttpResponse.json(targetBoard, {
        status: 200,
        statusText: "Deleted Successfully",
      });
    }
  ),

  http.patch<SwitchBoardParams, SwitchBoardRequestBody, EmptyType>(
    "/api/board/move/:id",
    async ({ params, request }) => {
      const { id } = params;
      // 클라이언트로부터 전달받은 order 값 사용
      const { order } = await request.json();

      // 스토리지에서 보드 목록을 가져옴
      const boards: BoardInfoType[] = handleStorage.get("board-storage") || [];

      // 이동할 보드의 현재 인덱스 찾기
      const boardIndex = boards.findIndex(
        (board: { id: string }) => board.id === id
      );

      if (boardIndex === -1) {
        return HttpResponse.json(null, {
          status: 404,
          statusText: "Board not found",
        });
      }

      // 보드 배열에서 해당 보드를 제거
      const [movedBoard] = boards.splice(boardIndex, 1);
      // 새로운 순서(order 값이 1-indexed이면 배열 index는 order - 1)
      const insertionIndex = Math.max(0, Math.min(order - 1, boards.length));
      boards.splice(insertionIndex, 0, movedBoard);

      // 전체 보드의 order 값을 재할당 (1부터 순차적으로)
      boards.forEach((board: BoardInfoType, index: number) => {
        board.order = index + 1;
      });

      // 스토리지에 업데이트된 보드 목록 저장
      handleStorage.set("board-storage", boards);

      return HttpResponse.json(boards, {
        status: 200,
        statusText: "Switched Successfully",
      });
    }
  ),
];
