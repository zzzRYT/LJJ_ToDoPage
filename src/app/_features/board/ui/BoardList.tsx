"use client";

import useBoardStore from "@/app/_store/boardStore";
import useTodoStore from "@/app/_store/todoStore";
import boardsApis from "../apis";
import todoApis from "../todo/apis";
import { toast } from "react-toastify";
import useDragAndDrop, { DragEndEvent } from "@/app/_hooks/useDragAndDrop";
import Board from "./Board";
import { useEffect } from "react";

export default function BoardList() {
  const { boards, setBoards, switchBoard } = useBoardStore();
  const { setTodos } = useTodoStore();

  const getBoard = async () => {
    const response = await boardsApis.getBoards();
    setBoards(response);
  };

  const getTodoListApi = async () => {
    try {
      const response = await todoApis.getTodos();
      setTodos(response);
    } catch {
      toast.error("Todo를 불러오는데 실패했습니다.");
    }
  };
  const { onDragEnd, onDragEnter, onDragLeave, onDragStart } =
    useDragAndDrop("right");
  const dragEndEvent: DragEndEvent = (from, to) => {
    if (from === to.toString()) return;
    boardsApis.switchBoard({ id: from, order: to });
    switchBoard({
      id: from,
      order: to,
    });
  };

  useEffect(() => {
    getBoard();
    getTodoListApi();
  }, []);
  return (
    <>
      {boards.map((board) => {
        return (
          <div
            className="mr-2 w-[350px] min-w-[350px] flex flex-col overflow-hidden rounded-lg transition-transform duration-75 border border-gray-700"
            key={board.id}
            draggable
            onDragStart={(e) => {
              onDragStart(e, { from: board.id });
            }}
            onDragEnter={(e) => {
              onDragEnter(e, { from: board.id, to: board.order });
            }}
            onDragEnd={(e) => {
              onDragEnd(e, {
                dragEndEvent,
              });
            }}
            onDragLeave={(e) => onDragLeave(e, { from: board.id })}
            onDragOver={(e) => e.preventDefault()}
          >
            <Board {...board} />
          </div>
        );
      })}
    </>
  );
}
