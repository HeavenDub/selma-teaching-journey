import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl">🧭</p>
      <h1 className="mt-4 font-display text-3xl font-bold">Off the route</h1>
      <p className="mt-2 max-w-sm text-ink-soft">
        This page isn't on the road from Safi to Casablanca. Even Selma's bus
        doesn't stop here.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-zellige-500 px-6 py-3 font-semibold text-white shadow-cozy transition-colors hover:bg-zellige-700"
      >
        Back to the main menu
      </Link>
    </div>
  );
}
