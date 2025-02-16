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
  switchTodo: ({
    boardId,
    todoId,
    order,
  }: {
    boardId: string;
    todoId: string;
    order: number;
  }) => void;
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
  switchTodo: ({ boardId, todoId, order }) =>
    set((state) => {
      const findTodo = state.todos.find((todo) => todo.boardId === boardId);
      if (findTodo) {
        const startTodoIndex = findTodo.todos.findIndex(
          (todo) => todo.id === todoId
        );
        const endTodoIndex = findTodo.todos.findIndex(
          (todo) => todo.order === order
        );

        if (startTodoIndex !== -1 && endTodoIndex !== -1) {
          const temp = findTodo.todos[startTodoIndex];
          findTodo.todos[startTodoIndex] = findTodo.todos[endTodoIndex];
          findTodo.todos[endTodoIndex] = temp;

          findTodo.todos[startTodoIndex].order = order;
          findTodo.todos[endTodoIndex].order = temp.order;
        }
      }
      return { todos: [...state.todos] };
    }),
}));

export default useTodoStore;
