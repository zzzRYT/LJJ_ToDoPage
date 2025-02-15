export type EmptyType = object;

//Board Type
export type AddBoardRequestBody = {
  title: string;
};
export type EditBoardParams = {
  id: string;
};
export type EditBoardRequestBody = {
  title: string;
};
export type DeleteBoardParams = {
  id: string;
};
export type SwitchBoardParams = {
  id: string;
};
export type SwitchBoardRequestBody = {
  order: number;
};

//Todo Type
export type TodoFromBoardParam = {
  boardId: string;
};

export type AddTodoRequestBody = {
  todo: string;
};
