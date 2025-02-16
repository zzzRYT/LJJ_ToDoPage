import { create } from "zustand";
import { TodoType } from "../_features/board/todo/type";

export interface TodoFromBoard {
  boardId: string;
  todos: TodoType[];
}

interface State {
  todos: TodoFromBoard[];
}
interface Action {
  setTodos: (todos: TodoFromBoard[]) => void;
  getTodo: (boardId: string) => TodoFromBoard;
  switchTodo: ({ todoId, order }: { todoId: string; order: number }) => void;
}

const useTodoStore = create<State & Action>((set, get) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
  getTodo: (boardId) => {
    const state = get();
    const { todos } = state;
    const findTodo = todos.find((todo) => todo.boardId === boardId);
    return findTodo ? findTodo : { boardId, todos: [] };
  },
  switchTodo: ({ todoId, order }) => set({}),
}));

export default useTodoStore;
