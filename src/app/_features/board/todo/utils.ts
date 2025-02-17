import { toast } from "react-toastify";
import todoApis from "./apis";
import { EditTodoHandlerParams, RemoveTodoHandlerParams } from "./type";
import useTodoStore from "@/app/_store/todoStore";

export async function removeTodoHandler({ todoId }: RemoveTodoHandlerParams) {
  try {
    const response = await todoApis.removeTodo({
      todoId: todoId,
    });
    useTodoStore.getState().setTodos(response);
  } catch {
    toast.error("삭제에 실패했습니다. 다시 시도해 주세요.");
  }
}

export async function editTodoHandler({
  todoId,
  todo,
  isCompleted,
}: Partial<EditTodoHandlerParams>) {
  try {
    const response = await todoApis.updateTodo({
      todoId: todoId!,
      todo,
      isCompleted,
    });
    useTodoStore.getState().updateTodo(response);
  } catch (error: unknown) {
    if ((error as Error).message === "Todo must be at least 2 characters") {
      toast.error("Todo의 길이는 2자 이상이어야 합니다.");
    } else {
      toast.error("Todo 수정에 실패했습니다. 다시 시도해 주세요.");
    }
  }
}
