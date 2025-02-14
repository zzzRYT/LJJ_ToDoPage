import Board from "../board/ui/Board";

export default function Contents() {
  return (
    <div className="flex flex-col relative flex-auto h-full">
      <div className="flex flex-auto flex-col overflow-y-hidden relative">
        <div className="flex-auto flex h-0 px-4 py-2 overflow-y-hidden relative">
          <Board />
          <Board />
          <Board />
          <Board />
        </div>
      </div>
    </div>
  );
}
