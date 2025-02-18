import { Droppable, Draggable } from "@hello-pangea/dnd";
import { TodoType } from "../type";
import useTodoStore from "@/app/_store/todoStore";
import Todo from "./Todo";

interface TodoListProps {
  boardId: TodoType["boardId"];
}

export default function TodoList({ boardId }: TodoListProps) {
  const { getTodos } = useTodoStore();
  const todos = getTodos(boardId);

  return (
    <Droppable droppableId={boardId} type="TODO">
      {(provided) => (
        <div
          className="todo-list"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {todos.map((todo, index) => (
            <Draggable key={todo.id} draggableId={todo.id} index={index}>
              {(provided) => (
                <div
                  className="mb-2"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <Todo {...todo} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
