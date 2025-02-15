import { BoardType } from "@/app/_store/boardStore";

export type BoardReturn = BoardType;

export type EllipsisStateType = {
  id: string;
  isOpen: boolean;
  isEdit: boolean;
  isRemove: boolean;
};

export interface EllipsisBoardState extends EllipsisStateType {
  title: string;
}

export interface EllipsisTodoState extends EllipsisStateType {
  todo: string;
  isCompleted: boolean;
}
