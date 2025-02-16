import Image from "next/image";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { changeInfo } from "@/app/_utils";
import EllipsisMenu from "@/app/_features/board/ui/EllipsisMenu";
import { EllipsisTodoState } from "../../type";
import { TodoProps } from "../type";
import todoApis from "../apis";
import { toast } from "react-toastify";
import useTodoStore from "@/app/_store/todoStore";

export default function Todo(props: TodoProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ellipsisInfo, setEllipsisInfo] = useState<EllipsisTodoState>({
    id: "",
    isOpen: false,
    isEdit: false,
    isRemove: false,
    todo: props.todo,
    isCompleted: props.isCompleted,
  });

  const { setTodos } = useTodoStore();

  const onChangeTodoTitle = changeInfo.text<EllipsisTodoState>({
    setState: setEllipsisInfo,
  });
  const onToggleEllipsis = changeInfo.toggle<EllipsisTodoState>({
    setState: setEllipsisInfo,
    key: "isOpen",
  });

  const onEditTodo: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === "Enter") {
      try {
        const response = await todoApis.updateTodo({
          boardId: props.boardId,
          todoId: props.id,
          todo: ellipsisInfo.todo,
        });
        setTodos(response);
      } catch {
        toast.error("Todo 수정에 실패했습니다. 다시 시도해 주세요.");
      }
      setEllipsisInfo((prev) => ({ ...prev, isEdit: !prev.isEdit }));
    }
  };

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
          id="todo"
          onChange={onChangeTodoTitle}
          onKeyDown={onEditTodo}
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
          <EllipsisMenu
            id={props.boardId}
            todoId={props.id}
            setState={setEllipsisInfo}
            state="todo"
          />
        )}
      </div>
    </div>
  );
}
