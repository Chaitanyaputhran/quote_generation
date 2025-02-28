import { useRouter } from "next/router";
import QuoteManager from "../components/QuoteManager";
// import QuoteList from "../components/QuoteList";
import { useState } from "react";

export default function Quote() {
  const [view, setView] = useState("menu");
  const router = useRouter();

  return (
    <div className="container">
      {view === "menu" ? (
        <div>
          <h1>Quote</h1>
          <button onClick={() => setView("generate")}>Generate Quote</button>
          <button onClick={() => setView("view")}>View Quote</button>
        </div>
      ) : view === "generate" ? (
        <QuoteManager />
      ) : (
        <QuoteList />
      )}
      <button onClick={() => router.push("/")}>Back</button>
    </div>
  );
}
