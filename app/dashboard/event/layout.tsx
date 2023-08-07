export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-screen overflow-auto">
      {children}
    </div>
  );
}
