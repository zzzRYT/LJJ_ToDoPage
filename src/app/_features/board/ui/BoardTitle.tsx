import useTodoStore from "@/app/_store/todoStore";
import { changeInfo } from "@/app/_utils";
import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BoardTitleProps, EllipsisBoardState } from "../type";
import { editBoardHandler, removeBoardHandler } from "../utils";
import Image from "next/image";
import EllipsisMenu from "@/app/_components/EllipsisMenu";

export default function BoardTitle({ title, id }: BoardTitleProps) {
  const editRef = useRef<HTMLInputElement>(null);
  const { getTodos } = useTodoStore();

  const [ellipsisInfo, setEllipsisInfo] = useState<EllipsisBoardState>({
    isOpen: false,
    isEdit: false,
    isRemove: false,
    title: title,
  });

  //change Event
  const onToggleEllipsis = changeInfo.toggle<EllipsisBoardState>({
    setState: setEllipsisInfo,
    key: "isOpen",
  });
  const onChangeTitle = changeInfo.text<EllipsisBoardState>({
    setState: setEllipsisInfo,
  });

  //보드 수정
  const onClickEditButton: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      editBoardHandler({ id: id, title: ellipsisInfo.title });
      setEllipsisInfo((prev) => ({ ...prev, isEdit: false }));
    }
  };

  //보드 삭제
  const onClickRemoveHandler = () => removeBoardHandler({ id: id });

  const onToggleEdit = changeInfo.toggle<EllipsisBoardState>({
    setState: setEllipsisInfo,
    key: "isEdit",
  });

  //board event
  const handleOutside = useCallback(
    (e: MouseEvent) => {
      if (editRef?.current && !editRef.current.contains(e.target as Node)) {
        editBoardHandler({ id: id, title: ellipsisInfo.title });
        onToggleEdit();
      }
    },
    [editBoardHandler, onToggleEdit]
  );
  useEffect(() => {
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [handleOutside]);

  useEffect(() => {
    if (ellipsisInfo.isEdit) {
      editRef.current?.focus();
    }
  }, [ellipsisInfo.isEdit]);

  return (
    <div className="w-full flex-row flex flex-shrink-0 p-2">
      <div className="flex gap-4 justify-center items-center">
        {!ellipsisInfo.isEdit ? (
          <h2>{title}</h2>
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
          {getTodos(id).length}
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
            onRemove={onClickRemoveHandler}
            focusRef={editRef}
          />
        )}
      </div>
    </div>
  );
}
