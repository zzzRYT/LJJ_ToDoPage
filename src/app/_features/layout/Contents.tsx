"use client";

import { useBoardStore } from "@/app/_store/boardStore";
import Board from "../board/ui/Board";
import Link from "next/link";
import boardsApis from "../board/apis";
import { useEffect } from "react";

export default function Contents() {
  const { boards, setBoards } = useBoardStore();

  const getBoard = async () => {
    const response = await boardsApis.getBoards();
    setBoards(response);
  };

  useEffect(() => {
    getBoard();
  }, []);

  return (
    <div className="flex flex-col relative flex-auto h-full">
      <div className="flex flex-auto flex-col overflow-y-hidden relative">
        <div className="flex-auto flex h-0 px-4 py-2 overflow-y-hidden relative">
          {boards.map((board) => {
            return <Board key={board.id} {...board} />;
          })}
          <Link
            href="/board/create"
            className="w-10 text-5xl border-2 border-solid border-gray-600 flex justify-center items-center rounded-lg cursor-pointer hover:bg-gray-200"
          >
            <button>+</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
