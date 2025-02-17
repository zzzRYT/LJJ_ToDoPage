import useDragAndDrop, { DragEndEvent } from "@/app/_hooks/useDragAndDrop";
import { TodoType } from "../type";
import todoApis from "../apis";
import Todo from "./Todo";
import useTodoStore from "@/app/_store/todoStore";

export default function TodoList({ boardId }: Pick<TodoType, "boardId">) {
  const { onDragEnd, onDragEnter, onDragLeave, onDragStart } = useDragAndDrop();

  const { getTodos, moveTodo } = useTodoStore();

  //drag event
  const dragEndEvent: DragEndEvent = (from, to, board) => {
    if (from === to.toString()) return;
    todoApis.moveTodo({ todoId: from, order: to, boardId: board! });
    moveTodo({ id: from, order: to, boardId: board! });
  };

  return (
    <>
      {getTodos(boardId).map((todo) => {
        const propsData = {
          ...todo,
          boardId: boardId,
        };
        return (
          <div
            key={todo.id}
            alt-key={`todo-${todo.id}-${boardId}`}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              onDragStart(e, { from: todo.id, board: todo.boardId });
            }}
            onDragEnter={(e) => {
              e.stopPropagation();
              onDragEnter(e, {
                from: todo.id,
                to: todo.order,
                board: todo.boardId,
              });
            }}
            onDragEnd={(e) => {
              e.stopPropagation();
              console.log(e);

              onDragEnd(e, {
                dragEndEvent,
              });
            }}
            onDragLeave={(e) => {
              e.stopPropagation();
              onDragLeave(e, { from: todo.id, board: todo.boardId });
            }}
            onDragOver={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Todo {...propsData} />
          </div>
        );
      })}
    </>
  );
}
