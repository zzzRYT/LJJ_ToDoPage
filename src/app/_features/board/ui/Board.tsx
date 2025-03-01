import Link from "next/link";
import TodoList from "../todo/ui/TodoList";
import BoardTitle from "./BoardTitle";
import React from "react";
import { BoardType } from "../type";

const Board = (props: BoardType) => {
  return (
    <>
      <BoardTitle id={props.id} title={props.title} />
      <div className="overflow-auto overflow-x-hidden flex flex-col p-2 border-t-2 border-black border-solid flex-grow">
        <TodoList boardId={props.id} />
      </div>
      <Link
        className="flex justify-start pl-4 m-5 transition-all rounded-lg  hover:bg-gray-200"
        href={{
          pathname: "/info/create",
          query: { type: "todo", boardId: props.id },
        }}
      >
        <button>+ Add Item</button>
      </Link>
    </>
  );
};

export default React.memo(Board);
