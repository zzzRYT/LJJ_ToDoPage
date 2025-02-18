import { Draggable, Droppable } from "@hello-pangea/dnd";

interface DragAndDropSharingType {
  children: React.ReactNode;
  className: string;
}

interface DroppableContainerProps extends DragAndDropSharingType {
  droppableId: string;
  type: string;
  direction?: "horizontal" | "vertical";
}

interface DragContainerProps extends DragAndDropSharingType {
  draggableId: string;
  index: number;
}

/**
 * pangea-ui의 Droppable 컴포넌트를 감싸는 컴포넌트
 *
 * @param droppableId Droppable 컴포넌트에 들어가는 droppableId
 * @param type Droppable 컴포넌트에 들어가는 type
 * @param direction Droppable 컴포넌트에 들어가는 direction
 */
export function DroppableContainer(props: DroppableContainerProps) {
  return (
    <Droppable
      droppableId={props.droppableId}
      type={props.type}
      direction={props.direction}
    >
      {(provided) => (
        <div
          className={props.className}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {props.children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

/**
 * pangea-ui의 Draggable 컴포넌트를 감싸는 컴포넌트
 *
 * @param draggableId Draggable 컴포넌트에 들어가는 draggableId
 * @param index Draggable 컴포넌트에 들어가는 index
 */
export function DraggableContainer(props: DragContainerProps) {
  return (
    <Draggable
      key={props.draggableId}
      draggableId={props.draggableId}
      index={props.index}
    >
      {(provided) => (
        <div
          className={props.className}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {props.children}
        </div>
      )}
    </Draggable>
  );
}
