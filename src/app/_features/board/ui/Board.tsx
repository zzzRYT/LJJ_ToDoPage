import { BoardType } from "@/app/_store/boardStore";
import EllipsisMenu from "../../../_components/EllipsisMenu";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { changeInfo } from "@/app/_utils";
import Todo from "../todo/ui/Todo";
import { EllipsisBoardState } from "../type";
import todoApis from "../todo/apis";
import Link from "next/link";
import useTodoStore from "@/app/_store/todoStore";
import useDragAndDrop, { DragEndEvent } from "@/app/_hooks/useDragAndDrop";
import { editBoardHandler, removeBoardHandler } from "../utils";

export default function Board(props: BoardType) {
  const editRef = useRef<HTMLInputElement>(null);

  const { getTodo, switchTodo } = useTodoStore();

  const [ellipsisInfo, setEllipsisInfo] = useState<EllipsisBoardState>({
    id: "",
    isOpen: false,
    isEdit: false,
    isRemove: false,
    title: props.title,
  });

  const { onDragEnd, onDragEnter, onDragLeave, onDragStart } =
    useDragAndDrop("bottom");

  //change Event
  const onToggleEllipsis = changeInfo.toggle<EllipsisBoardState>({
    setState: setEllipsisInfo,
    key: "isOpen",
  });
  const onChangeTitle = changeInfo.text<EllipsisBoardState>({
    setState: setEllipsisInfo,
  });
  const onToggleEdit = changeInfo.toggle<EllipsisBoardState>({
    setState: setEllipsisInfo,
    key: "isEdit",
  });

  //board event
  function handleOutside(e: MouseEvent) {
    if (editRef?.current && !editRef.current.contains(e.target as Node)) {
      editBoardHandler({ id: props.id, title: ellipsisInfo.title });
      onToggleEdit();
    }
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [editRef]);

  const onClickEditButton: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      editBoardHandler({ id: props.id, title: ellipsisInfo.title });
      setEllipsisInfo((prev) => ({ ...prev, isEdit: false }));
    }
  };
  useEffect(() => {
    if (ellipsisInfo.isEdit) {
      editRef.current?.focus();
    }
  }, [ellipsisInfo.isEdit]);

  const callRemoveBoard = () => removeBoardHandler({ id: props.id });

  //drag event
  const dragEndEvent: DragEndEvent = (from, to) => {
    if (getTodo(props.id).todos.length === 1) return;
    todoApis.switchTodo({ todoId: from, boardId: props.id, order: to });
    switchTodo({
      boardId: props.id,
      todoId: from,
      order: to,
    });
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
            {getTodo(props.id)?.todos.length}
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
              setState={setEllipsisInfo}
              onRemove={callRemoveBoard}
              focusRef={editRef}
            />
          )}
        </div>
      </div>
      <div className="overflow-auto overflow-x-hidden flex flex-col p-2 border-2 border-black border-solid flex-grow">
        {getTodo(props.id)?.todos.map((todo) => {
          const propsData = {
            ...todo,
            boardId: props.id,
          };
          return (
            <div
              key={todo.id}
              draggable
              onDragStart={(e) => {
                e.stopPropagation();
                onDragStart(e, { from: todo.id });
              }}
              onDragEnter={(e) => {
                e.stopPropagation();
                onDragEnter(e, { from: todo.id, to: todo.order });
              }}
              onDragEnd={(e) => {
                e.stopPropagation();
                onDragEnd(e, {
                  dragEndEvent,
                });
              }}
              onDragLeave={(e) => {
                e.stopPropagation();
                onDragLeave(e, { from: todo.id });
              }}
              onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Todo {...propsData} />
            </div>
          );
        })}
        <Link
          className="flex justify-start pl-4 mt-5 transition-all rounded-lg hover:bg-gray-200"
          href={{
            pathname: "/info/create",
            query: { type: "todo", boardId: props.id },
          }}
        >
          <button>+ Add Item</button>
        </Link>
      </div>
    </>
  );
}
