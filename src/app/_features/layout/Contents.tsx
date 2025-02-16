"use client";

import { useBoardStore } from "@/app/_store/boardStore";
import Board from "../board/ui/Board";
import Link from "next/link";
import boardsApis from "../board/apis";
import { useEffect } from "react";
import useDragAndDrop, { DragEndEvent } from "@/app/_hooks/useDragAndDrop";
import useTodoStore from "@/app/_store/todoStore";
import todoApis from "../board/todo/apis";
import { toast } from "react-toastify";

export default function Contents() {
  const { boards, setBoards, switchBoard } = useBoardStore();
  const { setTodos } = useTodoStore();

  const { onDragEnd, onDragEnter, onDragLeave, onDragStart } =
    useDragAndDrop("right");

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

  const dragEndEvent: DragEndEvent = (from, to) => {
    if (boards.length === 1) return;
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
    <div className="flex flex-col relative flex-auto h-full">
      <div className="flex flex-auto flex-col overflow-y-hidden relative">
        <div className="flex-auto flex h-0 px-4 py-2 overflow-y-hidden relative">
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
          <Link
            href={{
              pathname: "/info/create",
              query: { type: "board" },
            }}
            className="w-10 text-5xl border-2 border-solid border-gray-600 flex justify-center items-center rounded-lg cursor-pointer hover:bg-gray-200"
          >
            <button>+</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
