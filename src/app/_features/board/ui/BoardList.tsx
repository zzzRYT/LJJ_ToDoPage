"use client";

import { useEffect, useState } from "react";
import useBoardStore from "@/app/_store/boardStore";
import boardsApis from "../apis";
import Board from "./Board";
import useTodoStore from "@/app/_store/todoStore";
import todoApis from "../todo/apis";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  DraggableContainer,
  DroppableContainer,
} from "@/app/_components/DragContainer";
import { handleDragEnd } from "../utils";

export default function BoardList() {
  const [isWindow, setIsWindow] = useState(false);
  const { boards, setBoards } = useBoardStore();
  const { setTodos } = useTodoStore();
  const getBoardList = async () => {
    const response = await boardsApis.getBoards();
    setBoards(response);
  };

  const getTodoList = async () => {
    const response = await todoApis.getTodos();
    setTodos(response);
  };

  useEffect(() => {
    if (isWindow) {
      getBoardList();
      getTodoList();
    }
  }, [isWindow]);

  useEffect(() => {
    setIsWindow(true);
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
