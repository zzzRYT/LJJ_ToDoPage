export interface TodoType {
  boardId: string;
  id: string;
  todo: string;
  isCompleted: boolean;
  order: number;
}
export interface MoveTodoParams {
  sourceBoardId: string;
  sourceIndex: number;
  destinationIndex: number;
  destinationBoardId: string;
}

export type AddTodoParams = Pick<TodoType, "boardId" | "todo">;
export type EditTodoParams = Omit<TodoType, "boardId" | "order">;
export type RemoveTodoParams = Pick<TodoType, "id">;
export type MoveTodoInBoardParams = Omit<MoveTodoParams, "destinationBoardId">;
export type moveTodoBetweenBoardsParams = MoveTodoParams;

export type RemoveTodoHandlerParams = Pick<TodoType, "boardId" | "id">;
export type EditTodoHandlerParams = Omit<TodoType, "order" | "boardId">;
