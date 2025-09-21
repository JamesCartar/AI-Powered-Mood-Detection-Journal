export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>

      <h1 className="text-xl font-semibold text-gray-700">
        Redirecting you to the Journal page...
      </h1>
      <p className="text-gray-500 mt-2">Please wait a moment.</p>
    </div>
  );
}
