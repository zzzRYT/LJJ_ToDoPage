import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { changeInfo } from "@/app/_utils";
import EllipsisMenu from "@/app/_features/board/ui/EllipsisMenu";
import { EllipsisTodoState } from "../../type";
import { TodoType } from "../type";

export default function Todo(props: TodoType) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ellipsisInfo, setEllipsisInfo] = useState<EllipsisTodoState>({
    id: "",
    isOpen: false,
    isEdit: false,
    isRemove: false,
    todo: props.todo,
    isCompleted: props.isCompleted,
  });

  const onChangeTodoTitle = changeInfo.text<EllipsisTodoState>({
    setState: setEllipsisInfo,
  });
  const onToggleEllipsis = changeInfo.toggle<EllipsisTodoState>({
    setState: setEllipsisInfo,
    key: "isOpen",
  });
  useEffect(() => {
    if (ellipsisInfo.isEdit) {
      inputRef.current?.focus();
    }
  }, [ellipsisInfo.isEdit]);

  return (
    <div className="border-b-2 p-2 m-1 flex items-center hover:bg-gray-100 ">
      <input type="checkbox" />
      {!ellipsisInfo.isEdit ? (
        <span>{ellipsisInfo.todo}</span>
      ) : (
        <input
          ref={inputRef}
          value={ellipsisInfo.todo}
          id="title"
          onChange={onChangeTodoTitle}
        />
      )}
      <span className="relative ml-auto">
        <button
          onClick={onToggleEllipsis}
          className="z-10 p-1 rounded-full transition-all hover:bg-gray-200"
        >
          <Image
            src={"/ellipsisIcon.svg"}
            alt="ellipsis"
            width={15}
            height={15}
          />
        </button>
      </span>
      <div className="relative">
        {ellipsisInfo.isOpen && (
          <EllipsisMenu id={props.id} setState={setEllipsisInfo} state="todo" />
        )}
      </div>
    </div>
  );
}
