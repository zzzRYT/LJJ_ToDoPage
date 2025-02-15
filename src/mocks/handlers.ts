import { HttpResponse, http } from "msw";

type EmptyType = object;

type AddBoardRequestBody = {
  title: string;
};

type EditBoardParams = {
  id: string;
};
type EditBoardRequestBody = {
  title: string;
};

type DeleteBoardParams = {
  id: string;
};

export const handlers = [
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

      const newBoard = {
        id: (Math.random() * 10000).toFixed().toString(),
        title: title,
        todos: [],
      };

      if (title.length > 15) {
        return HttpResponse.json(null, {
          status: 400,
          statusText: "Title is too long. Please check your request.",
        });
      }

      const boards = JSON.parse(
        window.localStorage.getItem("board-storage") || "[]"
      );
      window.localStorage.setItem(
        "board-storage",
        JSON.stringify([...boards, newBoard])
      );

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

      if (title.length > 15) {
        return HttpResponse.json(null, {
          status: 400,
          statusText: "Title is too long. Please check your request.",
        });
      }

      const boards = JSON.parse(
        window.localStorage.getItem("board-storage") || "[]"
      );

      const findBoard = boards.find((board: { id: string }) => board.id === id);
      if (findBoard) {
        findBoard.title = title;
      }

      window.localStorage.setItem("board-storage", JSON.stringify(boards));

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

      const boards = JSON.parse(
        window.localStorage.getItem("board-storage") || "[]"
      );

      const removeBoard = boards.filter(
        (board: { id: string }) => board.id !== id
      );

      window.localStorage.setItem("board-storage", JSON.stringify(removeBoard));

      return HttpResponse.json(removeBoard, {
        status: 200,
        statusText: "Deleted Successfully",
      });
    }
  ),
];
