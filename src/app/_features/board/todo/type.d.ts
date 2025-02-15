export interface TodoType {
  id: string;
  todo: string;
  isCompleted: boolean;
  order: number;
}

export interface TodoListReturn {
  boardId: string;
  todos: TodoType[];
}

export interface AddTodoStateType extends TodoType {
  isAdd: boolean;
}
