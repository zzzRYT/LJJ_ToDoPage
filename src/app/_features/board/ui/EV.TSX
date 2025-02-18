const DraggableBoard = ({ board, index }) => {
  return (
    <DraggableContainer
      key={board.id}
      draggableId={board.id}
      index={index + 1}
      className="mr-2 w-[350px] min-w-[350px] flex flex-col overflow-hidden rounded-lg transition-transform duration-75 border border-gray-700"
    >
      <Board {...board} />
    </DraggableContainer>
  );
};
