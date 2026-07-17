import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EEE9DC] px-4 text-center">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#161513]/40">
          404
        </p>
        <p className="mt-4 font-display text-4xl uppercase leading-tight text-[#161513]">
          Page Not Found
        </p>
        <p className="mt-2 text-sm text-[#161513]/65">
          This route doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F13A18] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#EEE9DC] transition-transform hover:-translate-y-0.5"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
