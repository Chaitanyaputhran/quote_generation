import React, { useState, useEffect } from "react";
import axios from "axios";

const QuoteList = () => {
    const [quotes, setQuotes] = useState([]);
    const [searchBy, setSearchBy] = useState("");
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const response = await axios.get("/api/quotes");
            setQuotes(response.data);
        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
    };

    const handleSearch = async () => {
        if (!searchBy || !searchValue) {
            alert("Please select a search option and enter a value.");
            return;
        }

        try {
            const response = await axios.get("/api/quotes", {
                params: { searchBy, value: searchValue },
            });
            setQuotes(response.data);
        } catch (error) {
            console.error("Error searching quotes:", error);
        }
    };

    const handleClear = () => {
        setSearchBy("");    
        setSearchValue(""); 
        fetchQuotes();      
    };

    // Function to format date as DD/MM/YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    // Filtering quotes based on selected month
    const filteredQuotes = quotes.filter((quote) => {
        if (searchBy === "month" && searchValue) {
            const quoteMonth = new Date(quote.date).getMonth() + 1; // Get month (1-12)
            return quoteMonth === parseInt(searchValue);
        }
        return true;
    });

    const generateQuote = (quoteId) => {
        window.location.href = `/api/generate-quote/${quoteId}`;
    };

    return (
        <div style={{ width: "80%", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>Quote List</h2>

            {/* Search Options */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
                <select 
                    value={searchBy} 
                    onChange={(e) => setSearchBy(e.target.value)}
                    style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                >
                    <option value="">Select</option>
                    <option value="customer_name">Customer Name</option>
                    <option value="quote_id">Quote ID</option>
                    <option value="month">Month</option>
                </select>

                {searchBy === "month" ? (
                    <select
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", width: "200px" }}
                    >
                        <option value="">Select Month</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                ) : (
                    <input
                        type="text"
                        placeholder="Enter value"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", width: "200px" }}
                    />
                )}

                <button 
                    onClick={handleSearch} 
                    style={{ padding: "8px 12px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                >
                    Search
                </button>

                <button 
                    onClick={handleClear} 
                    style={{ padding: "8px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                >
                    Clear
                </button>
            </div>

            {/* Quote Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#f9f9f9", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
                <thead>
                    <tr style={{ backgroundColor: "#007bff", color: "#fff", textAlign: "left" }}>
                        <th style={{ padding: "10px" }}>Quote ID</th>
                        <th style={{ padding: "10px" }}>Customer Name</th>
                        <th style={{ padding: "10px" }}>Date</th>
                        <th style={{ padding: "10px" }}>Total Cost</th>
                        <th style={{ padding: "10px" }}>Generate Quote</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredQuotes.length > 0 ? (
                        filteredQuotes.map((quote) => (
                            <tr key={quote.quote_id} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "10px" }}>{quote.quote_id}</td>
                                <td style={{ padding: "10px" }}>{quote.customer_name}</td>
                                <td style={{ padding: "10px" }}>{formatDate(quote.date)}</td>
                                <td style={{ padding: "10px" }}>{quote.total_cost}</td>
                                <td style={{ padding: "10px" }}>
                                    <button 
                                        onClick={() => generateQuote(quote.quote_id)} 
                                        style={{ padding: "5px 10px", backgroundColor: "#17a2b8", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                                    >
                                        Generate Quote
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center", padding: "10px", color: "#888" }}>No quotes found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default QuoteList;
