import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  addBoard: (title: string) => void;
  removeBoard: (id: string) => void;
}

export const useBoardStore = create<BoardStoreType>()(
  persist(
    (set) => ({
      boards: [] as BoardType[],
      addBoard: (title) =>
        set((state) => ({
          boards: [
            ...state.boards,
            {
              id: (Math.random() * 10000).toFixed().toString(),
              title,
              todos: [],
            },
          ],
        })),
      removeBoard: (id) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
        })),
    }),
    {
      name: "board-storage", // 로컬 스토리지에 저장될 키 이름
    }
  )
);
