import { useBoardStore } from "@/app/_store/boardStore";
import { Dispatch, SetStateAction } from "react";
import boardsApis from "../apis";
import { changeInfo } from "@/app/_utils";
import { toast } from "react-toastify";
import useTodoStore from "@/app/_store/todoStore";
import todoApis from "../todo/apis";

interface EllipsisMenuProps<T> {
  id: string;
  todoId?: string;
  setState: Dispatch<SetStateAction<T>>;
  state: "board" | "todo";
}

export default function EllipsisMenu<T>({
  id,
  setState,
  state,
  todoId,
}: EllipsisMenuProps<T>) {
  const onToggleEdit = changeInfo.toggle<T>({
    setState,
    key: ["isEdit", "isOpen"] as (keyof T)[],
  });
  const { removeBoard } = useBoardStore();
  const { setTodos } = useTodoStore();

  const onToggleCloseEllipsis = changeInfo.toggle<T>({
    setState,
    key: "isOpen" as keyof T,
  });

  const callRemoveBoard = async () => {
    try {
      await boardsApis.removeBoard(id);
      removeBoard(id);
    } catch {
      toast.error("삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };
  const callRemoveTodo = async () => {
    try {
      const response = await todoApis.removeTodo({
        boardId: id,
        todoId: todoId!,
      });
      setTodos(response);
    } catch {
      toast.error("삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const onRemoveBoard = () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      if (state === "board") {
        callRemoveBoard();
      } else {
        callRemoveTodo();
      }
      setState((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <>
      <div className="absolute z-20 right-0 top-5 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
        <button
          onClick={onToggleEdit}
          className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
        >
          수정
        </button>
        <button
          onClick={onRemoveBoard}
          className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
        >
          삭제
        </button>
      </div>
      <div
        className="fixed left-0 top-0 w-screen h-screen z-10"
        onClick={onToggleCloseEllipsis}
      ></div>
    </>
  );
}
