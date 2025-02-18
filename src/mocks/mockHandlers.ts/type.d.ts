export type EmptyType = object;

type BoardInfoType = {
  id: string;
  title: string;
  order: number;
};

//Board Type
export type AddBoardRequestBody = Pick<BoardInfoType, "title">;
export type EditBoardParams = Pick<BoardInfoType, "id">;
export type EditBoardRequestBody = Pick<BoardInfoType, "title">;
export type DeleteBoardParams = Pick<BoardInfoType, "id">;
export type SwitchBoardParams = Pick<BoardInfoType, "id">;
export type SwitchBoardRequestBody = Pick<BoardInfoType, "order">;

type TodoInfoType = {
  boardId: string;
  id: string;
  todo: string;
  order: number;
  isCompleted: boolean;
  sourceIndex: number;
  sourceBoardId: string;
  destinationIndex: number;
  destinationBoardId: string;
};

//Todo Type
export type TodoFromBoardParam = Pick<TodoInfoType, "boardId">;
export type AddTodoRequestBody = Pick<TodoInfoType, "todo">;
export type UpdateTodoParams = Pick<TodoInfoType, "id">;
export type UpdateTodoRequestBody = Pick<TodoInfoType, "todo" | "isCompleted">;
export type DeleteTodoParams = Pick<TodoInfoType, "id">;
type MoveTodoParams = Pick<
  TodoInfoType,
  "sourceBoardId" | "destinationBoardId"
>;
type MoveTodoRequestBody = Pick<
  TodoInfoType,
  "sourceIndex" | "destinationIndex"
>;
export type MoveTodoInBoardRequestBody = Omit<
  MoveTodoRequestBody,
  "destinationBoardId"
>;
export type MoveTodoBetweenBoardsRequestBody = MoveTodoRequestBody;
