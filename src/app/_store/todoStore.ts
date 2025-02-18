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
  moveTodoWithinBoard: (
    boardId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  // 보드 간 이동
  moveTodoBetweenBoards: (
    sourceBoardId: string,
    destinationBoardId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
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
  moveTodoWithinBoard: (boardId, sourceIndex, destinationIndex) =>
    set((state) => {
      // 해당 보드의 Todo 목록을 순서대로 정렬
      const boardTodos = state.todos
        .filter((t) => t.boardId === boardId)
        .sort((a, b) => a.order - b.order);
      // 유효성 검사
      if (
        sourceIndex < 0 ||
        sourceIndex >= boardTodos.length ||
        destinationIndex < 0 ||
        destinationIndex >= boardTodos.length
      ) {
        return { todos: state.todos };
      }
      // 항목 재배열
      const [movedTodo] = boardTodos.splice(sourceIndex, 1);
      boardTodos.splice(destinationIndex, 0, movedTodo);
      // 보드 내의 order 업데이트
      boardTodos.forEach((todo, i) => {
        todo.order = i + 1;
      });
      // 전체 todos 배열 업데이트: 해당 보드의 Todo들만 교체
      const newTodos = state.todos.map((todo) =>
        todo.boardId === boardId
          ? boardTodos.find((t) => t.id === todo.id) || todo
          : todo
      );
      return { todos: newTodos };
    }),
  // 보드 간에 Todo 항목 이동
  moveTodoBetweenBoards: (
    sourceBoardId,
    destinationBoardId,
    sourceIndex,
    destinationIndex
  ) =>
    set((state) => {
      // 소스 보드의 Todo 목록
      const sourceTodos = state.todos
        .filter((t) => t.boardId === sourceBoardId)
        .sort((a, b) => a.order - b.order);
      // 목적 보드의 Todo 목록
      const destinationTodos = state.todos
        .filter((t) => t.boardId === destinationBoardId)
        .sort((a, b) => a.order - b.order);
      if (sourceIndex < 0 || sourceIndex >= sourceTodos.length) {
        return { todos: state.todos };
      }
      // 소스 보드에서 항목 제거
      const [movedTodo] = sourceTodos.splice(sourceIndex, 1);
      // 이동한 항목의 boardId 업데이트
      movedTodo.boardId = destinationBoardId;
      // 목적 보드에 항목 추가 (원하는 위치에 삽입)
      destinationTodos.splice(destinationIndex, 0, movedTodo);
      // 두 보드의 order 값 재설정
      sourceTodos.forEach((todo, i) => (todo.order = i + 1));
      destinationTodos.forEach((todo, i) => (todo.order = i + 1));
      // 나머지 보드의 Todo들은 그대로 두고, 업데이트한 두 보드의 Todo들을 다시 병합
      const otherTodos = state.todos.filter(
        (t) => t.boardId !== sourceBoardId && t.boardId !== destinationBoardId
      );
      return { todos: [...otherTodos, ...sourceTodos, ...destinationTodos] };
    }),
}));

export default useTodoStore;
