import Image from "next/image";
import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { changeInfo } from "@/app/_utils";
import EllipsisMenu from "@/app/_components/EllipsisMenu";
import { EllipsisTodoState } from "../../type";
import { TodoProps } from "../type";
import { editTodoHandler, removeTodoHandler } from "../utils";

export default function Todo(props: TodoProps) {
  const todoRef = useRef<HTMLInputElement>(null);
  const [ellipsisInfo, setEllipsisInfo] = useState<EllipsisTodoState>({
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

  const onToggleEdit = changeInfo.toggle<EllipsisTodoState>({
    setState: setEllipsisInfo,
    key: "isEdit",
  });
  const onToggleIsCompleted = changeInfo.toggle<EllipsisTodoState>({
    setState: setEllipsisInfo,
    key: "isCompleted",
  });

  const callRemoveTodo = () =>
    removeTodoHandler({ todoId: props.id, boardId: props.boardId });

  const onEditTodo: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      editTodoHandler({
        boardId: props.boardId,
        todo: ellipsisInfo.todo,
        todoId: props.id,
      });
      setEllipsisInfo((prev) => ({ ...prev, isEdit: !prev.isEdit }));
    }
  };

  const onEditIsCompleted = async () => {
    editTodoHandler({
      boardId: props.boardId,
      todoId: props.id,
      isCompleted: !ellipsisInfo.isCompleted,
    });
    onToggleIsCompleted();
  };

  const handleOutside = useCallback(
    (e: MouseEvent) => {
      if (todoRef?.current && !todoRef.current.contains(e.target as Node)) {
        editTodoHandler({
          boardId: props.boardId,
          todo: ellipsisInfo.todo,
          todoId: props.id,
        });
        onToggleEdit();
      }
    },
    [editTodoHandler, onToggleEdit]
  );
  //input 외 클릭시 input close
  useEffect(() => {
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [handleOutside]);

  useEffect(() => {
    if (ellipsisInfo.isEdit) {
      todoRef.current?.focus();
    }
  }, [ellipsisInfo.isEdit]);

  return (
    <div className="border-b-2 p-2 m-1 flex items-center hover:bg-gray-100 ">
      <input
        type="checkbox"
        checked={ellipsisInfo.isCompleted}
        onChange={onEditIsCompleted}
      />
      {!ellipsisInfo.isEdit ? (
        <div className="w-[340px] break-words whitespace-pre-wrap overflow-hidden pl-2">
          <p className={`${ellipsisInfo.isCompleted ? "line-through" : ""}`}>
            {props.todo}
          </p>
        </div>
      ) : (
        <input
          className="w-[340px] break-words whitespace-pre-wrap overflow-hidden pl-2"
          ref={todoRef}
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
            width={18}
            height={18}
          />
        </button>
      </span>
      <div className="relative">
        {ellipsisInfo.isOpen && (
          <EllipsisMenu setState={setEllipsisInfo} onRemove={callRemoveTodo} />
        )}
      </div>
    </div>
  );
}
