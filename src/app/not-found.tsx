export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
