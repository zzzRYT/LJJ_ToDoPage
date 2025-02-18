"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { changeInfo } from "@/app/_utils";
import useBoardStore from "@/app/_store/boardStore";
import boardsApis from "../_features/board/apis";
import { toast } from "react-toastify";
import todoApis from "../_features/board/todo/apis";
import useTodoStore from "@/app/_store/todoStore";

interface InfoStateType {
  title: string;
}

export default function CreateModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const boardId = searchParams.get("boardId");

  const inputRef = useRef<HTMLInputElement>(null);

  const { addBoard } = useBoardStore();
  const { addTodo } = useTodoStore();

  const [info, setInfo] = useState<InfoStateType>({
    title: "",
  });

  const onChangeBoardName = changeInfo.text<InfoStateType>({
    setState: setInfo,
  });

  const onAddBoardHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (type === "board") {
      try {
        const response = await boardsApis.addBoard({ title: info.title });
        addBoard(response);
      } catch {
        toast.error("Title은 1자 이상 15자 이하로 입력해주세요.");
      }
    } else {
      try {
        const response = await todoApis.addTodo({
          boardId: boardId!,
          todo: info.title,
        });
        addTodo(response);
      } catch {
        toast.error("Todo는 2자 이상 입력해주세요.");
      }
    }
    router.back();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [router]);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 overflow-hidden"
        onClick={() => router.back()}
      />
      <form
        onSubmit={onAddBoardHandler}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      >
        <div className="w-96 p-5 border-2 border-white  border-solid rounded-2xl bg-white z-10">
          <h1 className="text-2xl font-bold">
            {type === "board" ? <>Board 추가</> : <>Todo 추가</>}
          </h1>
          <input
            ref={inputRef}
            value={info.title}
            onChange={onChangeBoardName}
            id="title"
            className="w-full h-10 mt-5 p-2 border-2 border-black border-solid rounded-xl"
            placeholder={
              type === "board" ? "Board 이름을 입력하세요" : "Todo를 입력하세요"
            }
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
