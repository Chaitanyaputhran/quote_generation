import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">Welcome</h1>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => router.push("/quotes")}
        >
          Quote
        </button>
        <button 
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={() => router.push("/bill")}
        >
          Bill
        </button>
        <button 
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={() => router.push("/expense")}
        >
          Expense
        </button>
      </div>
    </div>
  );
}
