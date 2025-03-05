"use client";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl text-red-500">Authentication Error</h1>
      <p className="text-gray-400 mt-4">
        Unable to fetch authentication token. Please try again later.
      </p>
    </div>
  );
}
