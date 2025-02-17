import boardsApis from "./apis";
import useBoardStore from "@/app/_store/boardStore";
import { EditBoardHandlerParams, RemoveBoardHandlerParams } from "./type";
import { toast } from "react-toastify";

export async function editBoardHandler({ id, title }: EditBoardHandlerParams) {
  try {
    const response = await boardsApis.updateBoard({
      id,
      title,
    });
    useBoardStore.getState().updateBoard(response);
  } catch {
    toast.error("Board의 길이는 1~15자여야 합니다.");
  }
}

export async function removeBoardHandler({ id }: RemoveBoardHandlerParams) {
  try {
    await boardsApis.removeBoard(id);
    useBoardStore.getState().removeBoard(id);
  } catch {
    toast.error("삭제에 실패했습니다. 다시 시도해 주세요.");
  }
}
