import Link from 'next/link';
import { getUserSession } from "@/lib/actions/auth.actions";

export default async function Home() {
  const { session } = await getUserSession()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Welcome to the Home Page</h1>
      {!session && ( 
        <Link href="/signup" className="bg-black text-white px-6 py-3 rounded-md shadow-md hover:bg-gray-800 transition-colors duration-300">
          Sign Up
        </Link>
        
      )}
    </div>
  );
}
