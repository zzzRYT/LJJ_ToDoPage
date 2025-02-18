import { BoardType } from "@/app/_store/boardStore";

export interface BoardType {
  id: string;
  title: string;
  order: number;
}
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

export type AddBoardParams = Pick<BoardType, "title">;
export type EditBoardParams = Omit<BoardType, "order">;
export type RemoveBoardParams = Pick<BoardType, "id">;
export type MoveBoardParams = Pick<BoardType, "id" | "order">;

export type EditBoardHandlerParams = Pick<BoardUtilType, "id" | "title">;
export type RemoveBoardHandlerParams = Pick<BoardUtilType, "id">;
