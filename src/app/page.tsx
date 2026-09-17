import { SalesForm } from "@/components/SalesForm";

export default function Home() {
  return (
    <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/20">
      <SalesForm />
    </main>
  );
}
