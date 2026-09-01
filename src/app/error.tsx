"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
          500
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Something went wrong!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          An unexpected error occurred. Please try again later.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
