import Navbar from "@/components/navbar";

export default async function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={false} />
    </main>
  );
}
