export interface TodoType {
  boardId: string;
  id: string;
  todo: string;
  isCompleted: boolean;
  order: number;
}

export interface TodoUtilType {
  todoId: string;
  todo: string;
  isCompleted: boolean;
  order: number;
  boardId: string;
}

export type RemoveTodoHandlerParams = Pick<TodoUtilType, "boardId" | "todoId">;
export type EditTodoHandlerParams = Omit<TodoUtilType, "order"> & {
  curTodo?: string;
};
