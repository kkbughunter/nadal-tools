function App() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 py-12 text-slate-100">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur">
        <p className="mb-3 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
          Vite + Tailwind
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready for GitHub Pages deployment
        </h1>
        <p className="mt-4 text-slate-300">
          This app is configured with Tailwind CSS v4 and a GitHub Actions
          workflow that deploys the Vite build output to GitHub Pages.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://vite.dev/guide/static-deploy.html#github-pages"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Vite Pages guide
          </a>
          <a
            href="https://tailwindcss.com/docs/installation/using-vite"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Tailwind + Vite setup
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
