import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full h-20 p-2 flex justify-between items-center border-b-2 border-black border-solid">
      <h1 className="text-xl font-bold ml-5 cursor-default">To Do List</h1>
      <Link
        href="/board/create"
        scroll={false}
        className="m-5 mr-10 p-2 rounded-xl hover:backdrop-brightness-90"
      >
        <button>보드추가</button>
      </Link>
    </div>
  );
}
