import { useRef } from "react";

export type DragEndEvent = (from: string, to: number, boardId?: string) => void;
type DragEvent = React.DragEvent<HTMLDivElement>;
type DragEventHandler<T> = (event: DragEvent, options: T) => void;

interface DragEventOptions {
  from: string;
  to: number;
  board: string;
}

const useDragAndDrop = () => {
  const fromRef = useRef<number | null>(null);
  const toRef = useRef<number | null>(null);
  const boardRef = useRef<string | null>(null);

  //현재 값을 저장하고 드래그 시작한 요소에 스타일 지정
  const onDragStart: DragEventHandler<Omit<DragEventOptions, "to">> = (
    e: DragEvent,
    { from, board }
  ) => {
    e.currentTarget.classList.add("drag-start");
    fromRef.current = Number(from);
    boardRef.current = board;
  };

  //자기 값이 아닐 때 클래스 지정
  const onDragEnter: DragEventHandler<DragEventOptions> = (
    e: DragEvent,
    { from, to, board }
  ) => {
    if (fromRef.current !== Number(from)) {
      e.currentTarget.classList.add("drag-over");
    }
    toRef.current = to;
    boardRef.current = board;
  };

  //드래그 벗어나면 스타일 제거
  const onDragLeave: DragEventHandler<Omit<DragEventOptions, "to">> = (
    e: DragEvent,
    { from }
  ) => {
    if (fromRef.current !== Number(from)) {
      e.currentTarget.classList.remove("drag-over");
    }
  };

  //드레그 끝나면 드래그 시작할때 클레스 제거
  const onDragEnd: DragEventHandler<{ dragEndEvent: DragEndEvent }> = (
    e: DragEvent,
    { dragEndEvent }
  ) => {
    const parent = e.currentTarget.parentElement;

    if (parent) {
      parent.querySelectorAll(e.currentTarget.tagName).forEach((row) => {
        row.classList.remove("drag-over");
      });
    }
    e.currentTarget.classList.remove("drag-start");

    if (fromRef.current && toRef.current) {
      dragEndEvent(
        fromRef.current.toString(),
        toRef.current,
        boardRef.current!
      );
      fromRef.current = null;
      toRef.current = null;
      boardRef.current = null;
    }
  };

  return { onDragEnd, onDragEnter, onDragStart, onDragLeave };
};

export default useDragAndDrop;
