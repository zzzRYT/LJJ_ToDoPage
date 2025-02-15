import { BoardType, useBoardStore } from "@/app/_store/boardStore";
import Todo from "../../todo/Todo";
import EllipsisMenu from "./EllipsisMenu";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { changeInfo } from "@/app/_utils";
import { EllipsisStateType } from "../type";
import boardsApis from "../apis";
import { toast } from "react-toastify";

export default function Board(props: BoardType) {
  const editRef = useRef<HTMLInputElement>(null);

  const { updateBoard } = useBoardStore();

  const [ellipsisInfo, setEllipsisInfo] = useState<EllipsisStateType>({
    id: "",
    isOpen: false,
    isEdit: false,
    isRemove: false,
    title: "",
  });

  useEffect(() => {
    if (ellipsisInfo.isEdit) {
      editRef.current?.focus();
    }
  }, [ellipsisInfo.isEdit]);

  const onToggleEllipsis = changeInfo.toggle<EllipsisStateType>({
    setState: setEllipsisInfo,
    key: "isOpen",
  });
  const onChangeTitle = changeInfo.text<EllipsisStateType>({
    setState: setEllipsisInfo,
  });

  const onClickEditButton: KeyboardEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.key === "Enter") {
      try {
        const response = await boardsApis.updateBoard({
          id: props.id,
          title: ellipsisInfo.title,
        });
        updateBoard(response);
      } catch {
        toast.error("Board의 길이는 1~20자여야 합니다.");
      }
      setEllipsisInfo((prev) => ({ ...prev, isEdit: false }));
    }
  };

  return (
    <>
      <div className="w-full flex-row flex flex-shrink-0 p-2">
        <div className="flex gap-4 justify-center items-center">
          {!ellipsisInfo.isEdit ? (
            <h2>{props.title}</h2>
          ) : (
            <input
              ref={editRef}
              type="text"
              id="title"
              value={ellipsisInfo.title}
              onChange={onChangeTitle}
              onKeyDown={onClickEditButton}
            />
          )}
          <span className="rounded-full bg-gray-200 w-5 h-5 flex justify-center items-center">
            {props.todos.length}
          </span>
        </div>
        <span className="relative ml-auto">
          <button className="z-10 p-1 rounded-full transition-all hover:bg-gray-200">
            <Image
              onClick={onToggleEllipsis}
              src={"/ellipsisIcon.svg"}
              alt="ellipsis"
              width={25}
              height={25}
            />
          </button>
        </span>
        <div className="relative">
          {ellipsisInfo.isOpen && (
            <EllipsisMenu id={props.id} setState={setEllipsisInfo} />
          )}
        </div>
      </div>
      <div className="flex flex-col p-2 border-2 border-black border-solid flex-grow">
        <Todo />
        <Todo />
        <Todo />
        <Todo />
        <Todo />
        <button className="flex justify-start pl-4 mt-5 transition-all rounded-lg hover:bg-gray-200">
          + Add Item
        </button>
      </div>
    </>
  );
}
