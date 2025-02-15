import { create } from "zustand";

export interface TodoType {
  id: number;
  description: string;
  isCompleted: boolean;
}

export interface BoardType {
  id: string;
  title: string;
  todos: TodoType[] | [];
}

export interface BoardStoreType {
  boards: BoardType[];
  setBoards: (boards: BoardType[]) => void;
  addBoard: (params: BoardType) => void;
  updateBoard: ({ title, id }: Omit<BoardType, "todos">) => void;
  removeBoard: (id: string) => void;
}

export const useBoardStore = create<BoardStoreType>()((set) => ({
  boards: [] as BoardType[],
  setBoards: (boards) => set({ boards }),
  addBoard: (params) =>
    set((state) => ({
      boards: [...state.boards, params],
    })),
  updateBoard: ({ title, id }) =>
    set((state) => {
      const findBoard = state.boards.find((board) => board.id === id);
      if (findBoard) {
        findBoard.title = title;
      }
      return {
        boards: [...state.boards],
      };
    }),
  removeBoard: (id) =>
    set((state) => {
      const removeBoard = state.boards.filter((board) => board.id !== id);
      return {
        boards: removeBoard,
      };
    }),
}));
