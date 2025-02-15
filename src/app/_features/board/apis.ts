import { BoardType } from "@/app/_store/boardStore";
import { BoardReturn } from "./type";

const boardsApis = {
  addBoard: async (title: string): Promise<BoardReturn> => {
    const response = await fetch("/api/new/board", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error("Failed to add a new board");
    }
    return response.json();
  },

  getBoards: async (): Promise<BoardReturn[]> => {
    const response = await fetch("/api/boards");

    if (!response.ok) {
      throw new Error("Failed to fetch boards");
    }
    return response.json();
  },
  updateBoard: async ({
    id,
    title,
  }: Omit<BoardType, "todos">): Promise<BoardReturn> => {
    const response = await fetch(`/api/board/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error("Failed to update a board");
    }
    return response.json();
  },

  removeBoard: async (id: string): Promise<BoardReturn> => {
    const response = await fetch(`/api/board/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to remove a board");
    }
    return response.json();
  },
};

export default boardsApis;
