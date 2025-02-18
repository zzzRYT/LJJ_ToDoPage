import { TodoType } from "../type";
import useTodoStore from "@/app/_store/todoStore";
import Todo from "./Todo";
import {
  DraggableContainer,
  DroppableContainer,
} from "@/app/_components/DragContainer";
import Link from "next/link";

interface TodoListProps {
  boardId: TodoType["boardId"];
}

export default function TodoList({ boardId }: TodoListProps) {
  const { getTodos } = useTodoStore();
  const todos = getTodos(boardId);

  return (
    <DroppableContainer
      droppableId={boardId}
      type="TODO"
      className="todo-list h-full"
      direction="vertical"
    >
      {todos.length !== 0 ? (
        todos.map((todo, index) => (
          <DraggableContainer
            key={todo.id}
            draggableId={todo.id}
            index={index}
            className="mb-2"
          >
            <Todo {...todo} />
          </DraggableContainer>
        ))
      ) : (
        <Link
          className="mt-2 flex justify-center text-gray-400"
          href={{
            pathname: "/info/create",
            query: { type: "todo", boardId: boardId },
          }}
        >
          <button>할 일이 없습니다.</button>
        </Link>
      )}
    </DroppableContainer>
  );
}
