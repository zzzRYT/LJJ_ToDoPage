import { BoardType } from "@/app/_store/boardStore";

export type BoardInfoType = Pick<BoardType, "title">;

export type BoardReturn = BoardType;

export interface EllipsisStateType {
  id: string;
  isOpen: boolean;
  isEdit: boolean;
  isRemove: boolean;
  title: string;
}
