import boardsApis from "./apis";
import useBoardStore from "@/app/_store/boardStore";
import { EditBoardHandlerParams, RemoveBoardHandlerParams } from "./type";
import useTodoStore from "@/app/_store/todoStore";
import todoApis from "./todo/apis";
import { DropResult } from "@hello-pangea/dnd";

export async function editBoardHandler({ id, title }: EditBoardHandlerParams) {
  const response = await boardsApis.updateBoard({
    id,
    title,
  });
  useBoardStore.getState().updateBoard(response);
}

export async function removeBoardHandler({ id }: RemoveBoardHandlerParams) {
  const response = await boardsApis.removeBoard({ id });
  useBoardStore.getState().removeBoard(response.id);
}

export const handleDragEnd = (result: DropResult) => {
  const { moveBoard } = useBoardStore.getState();
  const { moveTodoWithinBoard, moveTodoBetweenBoards } =
    useTodoStore.getState();
  if (!result.destination) return;

  //보드 이동
  if (result.type === "BOARD") {
    boardsApis.moveBoard({
      id: result.draggableId,
      order: result.destination.index,
    });
    moveBoard({
      id: result.draggableId,
      order: result.destination.index,
    });
  }
  //to 이동
  else if (result.type === "TODO") {
    const sourceBoardId = result.source.droppableId;
    const destBoardId = result.destination.droppableId;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    //같은 보드
    if (sourceBoardId === destBoardId) {
      moveTodoWithinBoard(sourceBoardId, sourceIndex, destinationIndex);
      todoApis.moveTodoInBoard({
        sourceBoardId,
        sourceIndex,
        destinationIndex,
      });
    }
    //다른 보드
    else {
      moveTodoBetweenBoards(
        sourceBoardId,
        destBoardId,
        sourceIndex,
        destinationIndex
      );
      todoApis.moveTodoBetweenBoards({
        sourceBoardId,
        destinationBoardId: destBoardId,
        sourceIndex,
        destinationIndex,
      });
    }
  }
};
