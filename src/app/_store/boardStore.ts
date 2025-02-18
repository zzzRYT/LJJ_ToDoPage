import { create } from "zustand";
import { BoardType } from "../_features/board/type";

interface State {
  boards: BoardType[];
}

interface Action {
  setBoards: (boards: BoardType[]) => void;
  addBoard: (params: BoardType) => void;
  updateBoard: ({ title, id }: Omit<BoardType, "order">) => void;
  removeBoard: (id: string) => void;
  moveBoard: ({ id, order }: { id: string; order: number }) => void;
}

const useBoardStore = create<State & Action>((set) => ({
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
  moveBoard: ({ id, order }) =>
    set((state) => {
      const startBoardIndex = state.boards.findIndex(
        (board) => board.id === id
      );
      if (startBoardIndex === -1) return { boards: state.boards };
      const [movedBoard] = state.boards.splice(startBoardIndex, 1);
      movedBoard.order = order;
      state.boards.splice(order - 1, 0, movedBoard);
      state.boards.forEach((board, i) => {
        board.order = i + 1;
      });
      return { boards: state.boards };
    }),
}));

export default useBoardStore;
