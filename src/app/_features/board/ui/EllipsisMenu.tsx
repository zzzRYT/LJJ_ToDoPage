import { useBoardStore } from "@/app/_store/boardStore";
import { Dispatch, SetStateAction } from "react";
import boardsApis from "../apis";
import { EllipsisStateType } from "../type";
import { changeInfo } from "@/app/_utils";
import { toast } from "react-toastify";

interface EllipsisMenuProps {
  id: string;
  setState: Dispatch<SetStateAction<EllipsisStateType>>;
}

export default function EllipsisMenu({ id, setState }: EllipsisMenuProps) {
  const onToggleEdit = changeInfo.toggle<EllipsisStateType>({
    setState,
    key: ["isEdit", "isOpen"],
  });
  const { removeBoard } = useBoardStore();

  const onToggleCloseEllipsis = changeInfo.toggle<EllipsisStateType>({
    setState,
    key: "isOpen",
  });

  const onRemoveBoard = async () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      try {
        await boardsApis.removeBoard(id);
        removeBoard(id);
      } catch {
        toast.error("보드 삭제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
    setState((prev) => ({ ...prev, isOpen: false }));
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
