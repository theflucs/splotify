export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-black">
      <div className="flex flex-col gap-4 items-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-lg">Connecting to Spotify API...</p>
      </div>
    </div>
  );
}
