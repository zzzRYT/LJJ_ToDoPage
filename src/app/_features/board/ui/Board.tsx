import { BoardType, useBoardStore } from "@/app/_store/boardStore";
import EllipsisMenu from "./EllipsisMenu";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { changeInfo } from "@/app/_utils";
import boardsApis from "../apis";
import { toast } from "react-toastify";
import Todo from "../todo/ui/Todo";
import { EllipsisBoardState } from "../type";
import { AddTodoStateType, TodoListReturn } from "../todo/type";
import todoApis from "../todo/apis";
import Link from "next/link";

export default function Board(props: BoardType) {
  const editRef = useRef<HTMLInputElement>(null);
  const addTodoRef = useRef<HTMLInputElement>(null);

  const { updateBoard } = useBoardStore();

  const [ellipsisInfo, setEllipsisInfo] = useState<EllipsisBoardState>({
    id: "",
    isOpen: false,
    isEdit: false,
    isRemove: false,
    title: "",
  });
  const [todoList, setTodoList] = useState<TodoListReturn>();
  const [newTodoInfo, setNewTodoInfo] = useState<AddTodoStateType>({
    id: "",
    todo: "",
    isCompleted: false,
    order: 0,
    isAdd: false,
  });

  const getTodoList = async () => {
    try {
      const response = await todoApis.getTodos(props.id);
      setTodoList(response);
    } catch {
      toast.error("Todo를 불러오는데 실패했습니다.");
    }
  };

  const onToggleAddTodo = changeInfo.toggle<AddTodoStateType>({
    setState: setNewTodoInfo,
    key: "isAdd",
  });

  const onToggleEllipsis = changeInfo.toggle<EllipsisBoardState>({
    setState: setEllipsisInfo,
    key: "isOpen",
  });
  const onChangeTitle = changeInfo.text<EllipsisBoardState>({
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

  useEffect(() => {
    if (ellipsisInfo.isEdit) {
      editRef.current?.focus();
    }
  }, [ellipsisInfo.isEdit]);

  useEffect(() => {
    if (newTodoInfo.isAdd) {
      addTodoRef.current?.focus();
    }
  }, [newTodoInfo.isAdd]);

  useEffect(() => {
    getTodoList();
  }, []);
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
            {todoList?.todos.length}
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
            <EllipsisMenu
              id={props.id}
              setState={setEllipsisInfo}
              state={"board"}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col p-2 border-2 border-black border-solid flex-grow">
        {todoList?.todos.map((todo) => {
          return (
            <div key={todo.id}>
              <Todo {...todo} />
            </div>
          );
        })}
        <Link
          href={{
            pathname: "/info/create",
            query: { type: "todo", boardId: props.id },
          }}
        >
          <button
            onClick={onToggleAddTodo}
            className="flex justify-start pl-4 mt-5 transition-all rounded-lg hover:bg-gray-200"
          >
            + Add Item
          </button>
        </Link>
      </div>
    </>
  );
}
