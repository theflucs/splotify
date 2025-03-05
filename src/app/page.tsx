import { getSpotifyAuthToken } from "./api/auth/queries";

export default async function Home() {
  const tokenData = await getSpotifyAuthToken();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 flex-grow items-center">
        <h1 className="text-6xl text-green-500 font-bold">Splotify</h1>
        <h2 className="text-xl text-white">Music, but messier!</h2>
        <section className="mt-8">
          {tokenData ? (
            <p className="text-green-400 flex items-center gap-2">
              Successfully connected to Spotify API.
            </p>
          ) : (
            <p className="text-red-500 mt-4 flex items-center gap-2">
              Failed to connect to Spotify API. Please try again later.
            </p>
          )}
        </section>
      </main>
      <footer className="w-full py-4 text-sm text-gray-400 text-center">
        <p>Copyright &copy; theflucs 2025</p>
      </footer>
    </div>
  );
}
