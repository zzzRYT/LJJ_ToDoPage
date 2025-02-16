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
  addTodo: (boardId: string, todo: TodoFromBoard) => void;
  updateTodo: (todo: TodoType) => void;
  removeTodo: (todoId: string) => void;
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
  addTodo: (boardId, todo) =>
    set((state) => {
      const updatedTodos = state.todos.filter((t) => t.boardId !== boardId);
      return {
        todos: [...updatedTodos, todo],
      };
    }),
  updateTodo: (todo) => set({}),
  removeTodo: (todoId) => set({}),
  switchTodo: ({ todoId, order }) => set({}),
}));

export default useTodoStore;
