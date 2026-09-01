"use client";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    </div>
  );
}