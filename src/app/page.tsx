export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 flex-grow items-center">
        <h1 className="text-6xl text-green-500 font-bold">Splotify</h1>
        <h2 className="text-xl text-white">Music, but messier!</h2>
      </main>
      <footer className="w-full py-4 text-sm text-gray-400 text-center">
        <p>Copyright &copy; theflucs 2025</p>
      </footer>
    </div>
  );
}
