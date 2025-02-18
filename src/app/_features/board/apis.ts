import { toast } from "react-toastify";
import {
  AddBoardParams,
  BoardReturn,
  EditBoardParams,
  MoveBoardParams,
  RemoveBoardParams,
} from "./type";

const boardsApis = {
  addBoard: async ({ title }: AddBoardParams): Promise<BoardReturn> => {
    const response = await fetch("/api/new/board", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      toast.error("보드 추가를 실패했습니다. 새로고침 후 다시 시도해 주세요.");
    }
    return response.json();
  },

  getBoards: async (): Promise<BoardReturn[]> => {
    const response = await fetch("/api/boards");

    if (!response.ok) {
      toast.error("보드 조회를 실패했습니다. 새로고침 후 다시 시도해 주세요.");
    }
    return response.json();
  },
  updateBoard: async ({ id, title }: EditBoardParams): Promise<BoardReturn> => {
    const response = await fetch(`/api/board/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        toast.error("보드는 1 ~ 15 글자 사이로 입력해주세요.");
        return;
      }
      toast.error("보드 추가를 실패했습니다. 새로고침 후 다시 시도해 주세요.");
    }
    return response.json();
  },

  removeBoard: async ({ id }: RemoveBoardParams): Promise<BoardReturn> => {
    const response = await fetch(`/api/board/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("보드 삭제를 실패했습니다. 새로고침 후 다시 시도해 주세요.");
    }
    return response.json();
  },

  moveBoard: async ({ id, order }: MoveBoardParams): Promise<BoardReturn> => {
    const response = await fetch(`/api/board/move/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, order }),
    });

    if (!response.ok) {
      toast.error("보드 이동을 실패했습니다. 새로고침 후 다시 시도해 주세요.");
    }
    return response.json();
  },
};

export default boardsApis;
