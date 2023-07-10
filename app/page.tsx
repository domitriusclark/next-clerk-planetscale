import Link from "next/link"
import { UserButton } from "@clerk/nextjs"


export default async function Home() {
  
  return (
    <main className="flex flex-col min-h-screen">
      <nav className="flex flex-col items-center pt-10 pr-10">
        <div className="flex self-end gap-10">
          <Link href="/">Home </Link>
          <UserButton afterSignOutUrl="/" />
        </div>      
      </nav>
    </main>
  )
}
