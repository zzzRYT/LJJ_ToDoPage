"use client";

import { useEffect } from "react";
import useBoardStore from "@/app/_store/boardStore";
import boardsApis from "../apis";
import Board from "./Board";
import useTodoStore from "@/app/_store/todoStore";
import todoApis from "../todo/apis";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import {
  DraggableContainer,
  DroppableContainer,
} from "@/app/_components/DragContainer";

export default function BoardList() {
  const { boards, setBoards, moveBoard } = useBoardStore();
  const { setTodos, moveTodoWithinBoard, moveTodoBetweenBoards } =
    useTodoStore();

  const getBoard = async () => {
    const response = await boardsApis.getBoards();
    setBoards(response);
  };

  const getTodoListApi = async () => {
    const response = await todoApis.getTodos();
    setTodos(response);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    if (result.type === "BOARD") {
      moveBoard({
        id: result.draggableId,
        order: result.destination.index,
      });
      boardsApis.moveBoard({
        id: result.draggableId,
        order: result.destination.index,
      });
    } else if (result.type === "TODO") {
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

  useEffect(() => {
    getBoard();
    getTodoListApi();
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <DroppableContainer
        droppableId="board-list"
        type="BOARD"
        direction="horizontal"
        className="board-list flex"
      >
        {boards.map((board, index) => (
          <DraggableContainer
            key={board.id}
            draggableId={board.id}
            index={index + 1}
            className="mr-2 w-[350px] min-w-[350px] flex flex-col overflow-hidden rounded-lg transition-transform duration-75 border border-gray-700"
          >
            <Board {...board} />
          </DraggableContainer>
        ))}
      </DroppableContainer>
    </DragDropContext>
  );
}
