"use client";

import { useRouter } from "next/navigation";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { BoardInfoType } from "../type";
import { changeInfo } from "@/app/_utils";
import { useBoardStore } from "@/app/_store/boardStore";
import boardsApis from "../apis";

export default function CreateBoardModal() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { addBoard } = useBoardStore();

  const [boardInfo, setBoardInfo] = useState<BoardInfoType>({
    title: "",
  });

  const onChangeBoardName = changeInfo.text<BoardInfoType>({
    setState: setBoardInfo,
  });

  const onAddBoardHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const response = await boardsApis.addBoard(boardInfo.title);
    addBoard(response);
    router.back();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [router]);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
        onClick={() => router.back()}
      />
      <form
        onSubmit={onAddBoardHandler}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      >
        <div className="w-96 p-5 border-2 border-white  border-solid rounded-2xl bg-white z-10">
          <h1 className="text-2xl font-bold">보드 추가</h1>
          <input
            ref={inputRef}
            value={boardInfo.title}
            onChange={onChangeBoardName}
            id="title"
            className="w-full h-10 mt-5 p-2 border-2 border-black border-solid rounded-xl"
            placeholder="보드 이름을 입력하세요"
          />
          <button
            type="submit"
            className="w-full h-10 mt-5 p-2 rounded-xl bg-blue-500 text-white font-bold"
          >
            추가
          </button>
        </div>
      </form>
    </>
  );
}
