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
  order: number;
}

interface State {
  boards: BoardType[];
}

interface Action {
  setBoards: (boards: BoardType[]) => void;
  addBoard: (params: BoardType) => void;
  updateBoard: ({ title, id }: Omit<BoardType, "todos">) => void;
  removeBoard: (id: string) => void;
  switchBoard: ({ id, order }: { id: string; order: number }) => void;
}

export const useBoardStore = create<State & Action>()((set) => ({
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
  switchBoard: ({ id, order }) =>
    set((state) => {
      const startBoardIndex = state.boards.findIndex(
        (board: { id: string }) => board.id === id
      );
      const endBoardIndex = state.boards.findIndex(
        (board: { order: number }) => board.order === order
      );

      if (startBoardIndex !== -1 && endBoardIndex !== -1) {
        const temp = state.boards[startBoardIndex];
        state.boards[startBoardIndex] = state.boards[endBoardIndex];
        state.boards[endBoardIndex] = temp;

        state.boards[startBoardIndex].order = order;
        state.boards[endBoardIndex].order = temp.order;
      }
      return {
        boards: [...state.boards],
      };
    }),
}));
