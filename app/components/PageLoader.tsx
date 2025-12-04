"use client";

interface PageLoaderProps {
  text?: string;
}

export default function PageLoader({ text }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 space-y-4">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-gray-700 text-sm font-medium">{text}</p>
    </div>
  );
}
