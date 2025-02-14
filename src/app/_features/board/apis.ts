import { BoardReturn } from "./type";

const boardsApis = {
  addBoard: async (title: string): Promise<void> => {
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
  },

  getBoards: async (): Promise<BoardReturn[]> => {
    const response = await fetch("/api/boards");

    if (!response.ok) {
      throw new Error("Failed to fetch boards");
    }
    return response.json();
  },
};

export default boardsApis;
