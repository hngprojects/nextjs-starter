import Link from "next/link";

export default function Forbidden() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-muted-foreground text-sm font-medium">403</p>
      <h1 className="text-2xl font-semibold">Forbidden</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        You don’t have permission to access this resource.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
      >
        Return home
      </Link>
    </main>
  );
}
