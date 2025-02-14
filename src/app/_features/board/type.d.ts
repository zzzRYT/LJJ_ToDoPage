import { BoardType } from "@/app/_store/boardStore";

export type BoardInfoType = Pick<BoardType, "title">;

export type BoardReturn = BoardType;
