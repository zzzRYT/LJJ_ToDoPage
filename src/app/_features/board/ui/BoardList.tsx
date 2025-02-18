"use client";

import useBoardStore from "@/app/_store/boardStore";
import boardsApis from "../apis";
import Board from "./Board";
import { useEffect } from "react";
import useTodoStore from "@/app/_store/todoStore";
import todoApis from "../todo/apis";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

export default function BoardList() {
  const { boards, setBoards, moveBoard } = useBoardStore();
  const { setTodos } = useTodoStore();

  const getBoard = async () => {
    const response = await boardsApis.getBoards();
    setBoards(response);
  };

  const getTodoListApi = async () => {
    const response = await todoApis.getTodos();
    setTodos(response);
  };

  const handleDragEnd = (result: DropResult) => {
    // item을 유효한 위치에 drop하지 않은 경우 종료
    if (!result.destination) return;
    moveBoard({
      id: result.draggableId,
      order: result.destination.index,
    });
    boardsApis.moveBoard({
      id: result.draggableId,
      order: result.destination.index,
    });
  };

  useEffect(() => {
    getBoard();
    getTodoListApi();
  }, []);
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board-list" direction="horizontal">
        {(provided) => (
          <div
            className="board-list"
            style={{ display: "flex" }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {boards.map((board, index) => {
              return (
                <Draggable
                  draggableId={`${board.id}`}
                  index={index + 1}
                  key={`${board.id}`}
                >
                  {(provided) => (
                    <div
                      className="mr-2 w-[350px] min-w-[350px] flex flex-col overflow-hidden rounded-lg transition-transform duration-75 border border-gray-700"
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <Board {...board} />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
