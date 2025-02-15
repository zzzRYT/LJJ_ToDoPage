import { boardHandlers } from "./mockHandlers.ts/boardMockApi";
import { todoHandlers } from "./mockHandlers.ts/todoMockApi";

export const handlers = [...boardHandlers, ...todoHandlers];
