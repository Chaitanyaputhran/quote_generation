"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuoteManager from "@/components/QuoteManager";  // Importing from components folder
import QuoteList from "@/components/QuoteList";        // Importing from components folder

export default function Quote() {
  const [view, setView] = useState("menu");
  const router = useRouter();

  return (
    <div className="container" style={styles.container}>
      {view === "menu" ? (
        <div style={styles.cardContainer}>
          <h1 style={styles.heading}>Quote Management</h1>
          <div style={styles.card}>
            <button onClick={() => setView("generate")} style={styles.button}>
              Generate Quote
            </button>
          </div>
          <div style={styles.card}>
            <button onClick={() => setView("view")} style={styles.button}>
              View Quote
            </button>
          </div>
        </div>
      ) : view === "generate" ? (
        <QuoteManager />
      ) : (
        <QuoteList />
      )}
      <div style={styles.backButtonContainer}>
        <button onClick={() => router.push("/")} style={styles.backButton}>
          Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
    flexDirection: "column", // This ensures the back button stays at the bottom
  },
  heading: {
    color: "black",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "auto", // Keeps the menu cards at the top
  },
  card: {
    width: "250px",
    padding: "20px",
    textAlign: "center",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "black",  // Changed to black
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  backButtonContainer: {
    marginTop: "auto", // Ensures the back button is always at the bottom
    width: "100%",
    padding: "10px",
    textAlign: "center",
  },
  backButton: {
    width: "150px", // Made the back button smaller
    padding: "8px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px", // Reduced font size for the back button
  },
};
