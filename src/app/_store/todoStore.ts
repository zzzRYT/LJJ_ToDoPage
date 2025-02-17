import { create } from "zustand";
import { TodoType } from "../_features/board/todo/type";

interface State {
  todos: TodoType[];
}
interface Action {
  setTodos: (todos: TodoType[]) => void;
  getTodos: (boardId: string) => TodoType[];
  addTodo: (todo: TodoType) => void;
  updateTodo: (todo: TodoType) => void;
  moveTodo: ({
    boardId,
    id,
    order,
  }: Omit<TodoType, "isCompleted" | "todo">) => void;
}

const useTodoStore = create<State & Action>((set, get) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
  getTodos: (boardId) =>
    get()
      .todos.filter((t) => t.boardId === boardId)
      .sort((a, b) => a.order - b.order),
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  updateTodo: (todo) =>
    set((state) => {
      const targetTodo = state.todos.find((t) => t.id === todo.id);
      if (!targetTodo) return { todos: state.todos };
      targetTodo.todo = todo.todo;
      targetTodo.isCompleted = todo.isCompleted;
      return { todos: state.todos };
    }),
  moveTodo: ({ boardId, id, order }) =>
    set((state) => {
      const targetTodo = state.todos.find((t) => t.id === id);
      if (!targetTodo) return { todos: state.todos };
      if (targetTodo.boardId !== boardId) {
        targetTodo.boardId = boardId;
      }
      const startTodoIndex = state.todos.findIndex((t) => t.id === id);
      if (startTodoIndex === -1) return { todos: state.todos };
      const [movedTodo] = state.todos.splice(startTodoIndex, 1);
      movedTodo.order = order;
      state.todos.splice(order - 1, 0, movedTodo);
      state.todos.forEach((t, i) => {
        t.order = i + 1;
      });
      return { todos: state.todos };
    }),
}));

export default useTodoStore;
