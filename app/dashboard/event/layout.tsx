export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col w-full h-screen mx-10 overflow-auto">
      {children}
    </main>
  );
}
