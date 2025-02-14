import { HttpResponse, http } from "msw";

export const handlers = [
  // POST 새로운 보드 생성
  http.post("/api/new/board", async ({ request }) => {
    const info = await request.formData();
    const title = info.get("title");

    const newBoard = {
      id: (Math.random() * 10000).toFixed().toString(),
      title: title,
      todos: [],
    };

    const boards = JSON.parse(window.localStorage.getItem("boards") || "[]");
    window.localStorage.setItem(
      "boards",
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
  }),
];
