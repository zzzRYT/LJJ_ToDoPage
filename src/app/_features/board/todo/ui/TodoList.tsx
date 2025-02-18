import { TodoType } from "../type";
import useTodoStore from "@/app/_store/todoStore";
import Todo from "./Todo";
import {
  DraggableContainer,
  DroppableContainer,
} from "@/app/_components/DragContainer";

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
      className="todo-list"
      direction="vertical"
    >
      {todos.map((todo, index) => (
        <DraggableContainer
          key={todo.id}
          draggableId={todo.id}
          index={index}
          className="mb-2"
        >
          <Todo {...todo} />
        </DraggableContainer>
      ))}
    </DroppableContainer>
  );
}
