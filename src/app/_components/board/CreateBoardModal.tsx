"use client";

import { useRouter } from "next/navigation";

export default function CreateBoardModal() {
  const router = useRouter();

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-0"
        onClick={() => router.back()}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-96 h-96 p-5 border-2 border-white  border-solid rounded-2xl bg-white z-10">
          <h1 className="text-2xl font-bold">보드 추가</h1>
          <input
            className="w-full h-10 mt-5 p-2 border-2 border-black border-solid rounded-xl"
            placeholder="보드 이름을 입력하세요"
          />
          <button className="w-full h-10 mt-5 p-2 rounded-xl bg-blue-500 text-white font-bold">
            추가
          </button>
        </div>
      </div>
    </>
  );
}
