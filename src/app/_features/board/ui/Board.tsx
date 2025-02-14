import Todo from "../../todo/Todo";

export default function Board() {
  return (
    <div className="mr-2 w-[350px] min-w-[350px] flex flex-col overflow-hidden rounded-lg transition-transform duration-75 border border-gray-700">
      <div className="flex-row gap-4 flex flex-shrink-0 p-2">
        <h2>보드 이름</h2>
        <span className="rounded-full bg-gray-200 w-5 h-5 flex justify-center items-center">
          2
        </span>
      </div>
      <div className="flex flex-col p-2 border-2 border-black border-solid flex-grow">
        <Todo />
        <Todo />
        <Todo />
        <Todo />
        <Todo />
        <button className="flex justify-start pl-4 mt-5 transition-all rounded-lg hover:bg-gray-200">
          + Add Item
        </button>
      </div>
    </div>
  );
}
