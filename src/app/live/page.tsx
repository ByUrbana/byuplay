export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">TV en vivo</h1>
      <p className="text-neutral-300">
        Aquí embebemos el reproductor usando <code>NEXT_PUBLIC_LIVE_URL</code>.
      </p>
      {/* Luego: <VideoPlayer src={process.env.NEXT_PUBLIC_LIVE_URL!} /> */}
    </main>
  );
}
