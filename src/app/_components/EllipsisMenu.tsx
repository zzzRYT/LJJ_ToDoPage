"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { changeInfo } from "@/app/_utils";

interface EllipsisMenuProps<T> {
  setState: Dispatch<SetStateAction<T>>;
  onRemove: () => void;
  focusRef?: React.RefObject<HTMLInputElement | null>;
}

export default function EllipsisMenu<T>({
  setState,
  onRemove,
}: EllipsisMenuProps<T>) {
  const yRef = useRef<HTMLInputElement>(null);
  const [isHalfWindow, setIsHalfWindow] = useState(false);
  const onToggleEdit = changeInfo.toggle<T>({
    setState,
    key: ["isEdit", "isOpen"] as (keyof T)[],
  });

  const onToggleCloseEllipsis = changeInfo.toggle<T>({
    setState,
    key: "isOpen" as keyof T,
  });
  const onRemoveHandler = () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      onRemove();
      onToggleCloseEllipsis();
    }
  };

  useEffect(() => {
    const handlePositionY = () => {
      if (yRef.current) {
        const rect = yRef.current.getBoundingClientRect().top;
        if (rect > 400) {
          setIsHalfWindow(true);
        } else {
          setIsHalfWindow(false);
        }
      }
    };
    handlePositionY();
    window.addEventListener("resize", handlePositionY);

    return () => {
      window.removeEventListener("resize", handlePositionY);
    };
  }, []);

  return (
    <>
      <div
        ref={yRef}
        className={`absolute z-20 right-0 ${
          isHalfWindow ? "top-[-110px]" : "top-3"
        } mt-2 w-48 bg-white rounded-lg shadow-lg py-1`}
      >
        <button
          onClick={onToggleEdit}
          className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
        >
          수정
        </button>
        <button
          onClick={onRemoveHandler}
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
