import useDragAndDrop, { DragEndEvent } from "@/app/_hooks/useDragAndDrop";
import { TodoProps } from "../type";
import todoApis from "../apis";
import useTodoStore from "@/app/_store/todoStore";
import Todo from "./Todo";

export default function TodoList({ boardId }: Pick<TodoProps, "boardId">) {
  const { onDragEnd, onDragEnter, onDragLeave, onDragStart } =
    useDragAndDrop("bottom");

  const { getTodo, switchTodo } = useTodoStore();

  //drag event
  const dragEndEvent: DragEndEvent = (from, to) => {
    if (from === to.toString()) return;
    todoApis.switchTodo({ todoId: from, boardId: boardId, order: to });
    switchTodo({
      boardId: boardId,
      todoId: from,
      order: to,
    });
  };
  return (
    <>
      {getTodo(boardId)?.todos.map((todo) => {
        const propsData = {
          ...todo,
          boardId: boardId,
        };
        return (
          <div
            key={todo.id}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              onDragStart(e, { from: todo.id });
            }}
            onDragEnter={(e) => {
              e.stopPropagation();
              onDragEnter(e, { from: todo.id, to: todo.order });
            }}
            onDragEnd={(e) => {
              e.stopPropagation();
              onDragEnd(e, {
                dragEndEvent,
              });
            }}
            onDragLeave={(e) => {
              e.stopPropagation();
              onDragLeave(e, { from: todo.id });
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
