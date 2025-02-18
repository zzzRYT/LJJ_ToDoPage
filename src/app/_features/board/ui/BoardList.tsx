"use client";

import { useEffect } from "react";
import useBoardStore from "@/app/_store/boardStore";
import boardsApis from "../apis";
import Board from "./Board";
import useTodoStore from "@/app/_store/todoStore";
import todoApis from "../todo/apis";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

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

  /**
   * onDragEnd 핸들러는 드래그 종료 시 호출됩니다.
   * result.type이 "BOARD"이면 보드(컬럼) 재정렬,
   * "TODO"이면 Todo 항목 이동(같은 보드 내 재정렬 혹은 보드 간 이동)을 처리합니다.
   */
  const handleDragEnd = (result: DropResult) => {
    // 유효하지 않은 드롭인 경우 종료
    if (!result.destination) return;

    // 드래그된 항목이 보드(컬럼)인 경우
    if (result.type === "BOARD") {
      // 보드 재정렬: result.draggableId는 보드 id, source와 destination.index를 이용
      moveBoard({
        id: result.draggableId,
        order: result.destination.index,
      });
      boardsApis.moveBoard({
        id: result.draggableId,
        order: result.destination.index,
      });
    }
    // 드래그된 항목이 Todo인 경우
    else if (result.type === "TODO") {
      const sourceBoardId = result.source.droppableId;
      const destBoardId = result.destination.droppableId;
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;

      // 같은 보드 내에서 순서 변경인 경우
      if (sourceBoardId === destBoardId) {
        moveTodoWithinBoard(sourceBoardId, sourceIndex, destinationIndex);
        todoApis.moveTodoInBoard({
          sourceBoardId,
          sourceIndex,
          destinationIndex,
        });
      }
      // 보드를 넘나드는 경우
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
      {/* 보드 전체 영역 Droppable (보드 재정렬을 위한) */}
      <Droppable droppableId="board-list" type="BOARD" direction="horizontal">
        {(provided) => (
          <div
            className="board-list flex"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {boards.map((board, index) => (
              <Draggable
                draggableId={board.id}
                index={index + 1}
                key={board.id}
              >
                {(provided) => (
                  <div
                    className="mr-2 w-[350px] min-w-[350px] flex flex-col overflow-hidden rounded-lg transition-transform duration-75 border border-gray-700"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Board {...board} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
