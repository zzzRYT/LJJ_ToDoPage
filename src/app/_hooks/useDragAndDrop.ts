import { useRef } from "react";

export type DragEndEvent = (from: string, to: number, boardId?: string) => void;
type DragEvent = React.DragEvent<HTMLDivElement>;
type DragEventHandler<T> = (event: DragEvent, options: T) => void;

interface DragEventOptions {
  from: string;
  to: number;
  board?: string;
}

const useDragAndDrop = (type: "todo" | "board") => {
  const fromRef = useRef<number | null>(null);
  const toRef = useRef<number | null>(null);
  const boardRef = useRef<number | null>(null);

  //현재 값을 저장하고 드래그 시작한 요소에 스타일 지정
  const onDragStart: DragEventHandler<Pick<DragEventOptions, "from">> = (
    e: DragEvent,
    { from }
  ) => {
    e.currentTarget.classList.add("drag-start");
    fromRef.current = Number(from);
  };

  //자기 값이 아닐 때 클래스 지정
  const onDragEnter: DragEventHandler<DragEventOptions> = (
    e: DragEvent,
    { from, to, board }
  ) => {
    if (fromRef.current !== Number(from)) {
      if (type === "todo") {
        e.currentTarget.classList.add("drag-over-bottom");
      } else {
        e.currentTarget.classList.add("drag-over-right");
      }
    }
    toRef.current = to;
    boardRef.current = Number(board);
  };

  //드래그 벗어나면 스타일 제거
  const onDragLeave: DragEventHandler<Pick<DragEventOptions, "from">> = (
    e: DragEvent,
    { from }
  ) => {
    if (fromRef.current !== Number(from)) {
      e.currentTarget.classList.remove("drag-over-bottom");
      e.currentTarget.classList.remove("drag-over-right");
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
        row.classList.remove("drag-over-bottom");
        row.classList.remove("drag-over-right");
      });
    }
    e.currentTarget.classList.remove("drag-start");

    if (fromRef.current && toRef.current && boardRef.current) {
      dragEndEvent(
        fromRef.current.toString(),
        toRef.current,
        boardRef.current.toString()
      );
      fromRef.current = null;
      toRef.current = null;
      boardRef.current = null;
    }
  };

  return {
    onDragEnd,
    onDragEnter,
    onDragStart,
    onDragLeave,
  };
};

export default useDragAndDrop;
