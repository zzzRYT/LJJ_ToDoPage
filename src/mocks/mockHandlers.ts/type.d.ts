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
  todoId: string;
  todo: string;
  order: number;
};

//Todo Type
export type TodoFromBoardParam = Pick<TodoInfoType, "boardId">;
export type AddTodoRequestBody = Pick<TodoInfoType, "todo">;
export type UPdateTodoParams = Pick<TodoInfoType, "boardId" | "todoId">;
export type UpdateTodoRequestBody = Pick<TodoInfoType, "todo">;
export type DeleteTodoParams = Pick<TodoInfoType, "boardId" | "todoId">;
