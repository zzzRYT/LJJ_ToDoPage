import Link from "next/link";
import BoardList from "../board/ui/BoardList";

export default function Contents() {
  return (
    <div className="flex flex-col relative flex-auto h-full">
      <div className="flex flex-auto flex-col overflow-y-hidden relative">
        <div className="flex-auto flex h-0 px-4 py-2 overflow-y-hidden relative">
          <BoardList />
          <Link
            href={{
              pathname: "/info/create",
              query: { type: "board" },
            }}
            className="w-10 text-5xl border-2 border-solid border-gray-600 flex justify-center items-center rounded-lg cursor-pointer hover:bg-gray-200"
          >
            <button>+</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
