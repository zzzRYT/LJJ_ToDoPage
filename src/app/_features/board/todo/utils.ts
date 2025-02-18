import todoApis from "./apis";
import { EditTodoHandlerParams, RemoveTodoHandlerParams } from "./type";
import useTodoStore from "@/app/_store/todoStore";

export async function removeTodoHandler({ id }: RemoveTodoHandlerParams) {
  const response = await todoApis.removeTodo({
    id,
  });
  useTodoStore.getState().setTodos(response);
}

export async function editTodoHandler({
  id,
  todo,
  isCompleted,
}: EditTodoHandlerParams) {
  const response = await todoApis.updateTodo({
    id,
    todo,
    isCompleted,
  });
  useTodoStore.getState().updateTodo(response);
}
