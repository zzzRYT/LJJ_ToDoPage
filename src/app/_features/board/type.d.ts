import { BoardType } from "@/app/_store/boardStore";

export type BoardReturn = BoardType;

export type EllipsisStateType = {
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

export type BoardTitleProps = Omit<BoardType, "order">;

export interface BoardUtilType {
  title: string;
  id: string;
}

export type EditBoardHandlerParams = Pick<BoardUtilType, "id" | "title">;
export type RemoveBoardHandlerParams = Pick<BoardUtilType, "id">;
