import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-black">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(30,20,60,0.4) 0%, rgba(0,0,0,1) 70%)",
        }}
      />

      <div className="relative z-10 text-center max-w-sm px-6">
        <div className="w-14 h-14 bg-white/[0.06] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/[0.08]">
          <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-2xl font-light text-white/80 mb-3">Not Found</h1>
        <p className="text-sm text-zinc-500 mb-8">
          This smartchain could not be found.
        </p>

        <Link
          href="https://aileco.com"
          className="inline-block px-5 py-2 rounded-full text-sm font-medium text-white/70 border border-white/10 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          aileco.com
        </Link>
      </div>
    </div>
  );
}
