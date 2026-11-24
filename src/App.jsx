
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";
import "./App.css";

function App() {
    const [search, setSearch] = useState("");
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);

    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [tickets, setTickets] = useState(1);

    const [bookingMessage, setBookingMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Fetch matches from Supabase
    async function fetchMatches() {
        setLoading(true);

        const { data, error } = await supabase
            .from("matches")
            .select("*")
            .order("match_date", { ascending: true });

        if (error) {
            console.error(
                "SUPABASE ERROR:",
                JSON.stringify(error, null, 2)
            );

            setBookingMessage(
                "Database error: " + error.message +
                (error.hint ? " | " + error.hint : "") +
                (error.details ? " | " + error.details : "")
            );

            setMessageType("error");
            setMatches([]);
        } else {
            setMatches(data || []);
            setBookingMessage("");
            setMessageType("");
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchMatches();
    }, []);

    // Search matches
    const filteredMatches = matches.filter((match) =>
        (match.team1 + " " + match.team2)
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // Open booking form
    function handleBooking(match) {
        setSelectedMatch(match);
        setBookingMessage("");
        setMessageType("");
        setCustomerName("");
        setCustomerEmail("");
        setTickets(1);

        setTimeout(() => {
            document.getElementById("booking")?.scrollIntoView({
                behavior: "smooth"
            });
        }, 100);
    }

    // Confirm booking
    async function handleSubmit(event) {
        event.preventDefault();

        if (!selectedMatch) return;

        if (tickets < 1 || tickets > 10) {
            setBookingMessage("Please select between 1 and 10 tickets.");
            setMessageType("error");
            return;
        }

        setBookingLoading(true);
        setBookingMessage("");

        const { data, error } = await supabase.rpc("book_ipl_tickets", {
            p_match_id: selectedMatch.id,
            p_customer_name: customerName,
            p_email: customerEmail,
            p_tickets: tickets
        });

        setBookingLoading(false);

        if (error) {
            console.error(
                "BOOKING ERROR:",
                JSON.stringify(error, null, 2)
            );

            setBookingMessage("Booking failed: " + error.message);
            setMessageType("error");
            return;
        }

        if (!data || data.success !== true) {
            setBookingMessage(
                data?.message || "Unable to complete your booking."
            );
            setMessageType("error");
            return;
        }

        setBookingMessage(
            "Thank you, " + customerName +
            "! Your booking for " +
            selectedMatch.team1 + " vs " +
            selectedMatch.team2 +
            " has been confirmed successfully."
        );

        setMessageType("success");

        setCustomerName("");
        setCustomerEmail("");
        setTickets(1);

        await fetchMatches();
    }

    return (
        <div>
            <Navbar />

            <Hero />

            {/* Match Section */}
            <section className="matches" id="matches">

                <h1>Upcoming IPL Matches</h1>

                <input
                    type="text"
                    placeholder="Search your favourite team..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {loading ? (
                    <p>Loading matches...</p>
                ) : (
                    <>
                        {bookingMessage && messageType === "error" && (
                            <p className="error-message">
                                {bookingMessage}
                            </p>
                        )}

                        <div className="match-container">
                            {filteredMatches.length > 0 ? (
                                filteredMatches.map((match) => (
                                    <MatchCard
                                        key={match.id}
                                        team1={match.team1}
                                        team2={match.team2}
                                        date={match.match_date}
                                        venue={match.venue}
                                        onBook={() => handleBooking(match)}
                                    />
                                ))
                            ) : (
                                <p className="no-results">
                                    No matches found!
                                </p>
                            )}
                        </div>
                    </>
                )}

            </section>

            {/* Booking Section */}
            <section className="booking-section" id="booking">

                <h1>Book Your IPL Tickets</h1>

                {selectedMatch ? (

                    <form
                        className="booking-form"
                        onSubmit={handleSubmit}
                    >

                        <h2>
                            {selectedMatch.team1} vs {selectedMatch.team2}
                        </h2>

                        <p>Date: {selectedMatch.match_date}</p>

                        <p>Venue: {selectedMatch.venue}</p>

                        <p>
                            Available Seats: {selectedMatch.available_seats}
                        </p>

                        <label>Your Name</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={customerName}
                            onChange={(e) =>
                                setCustomerName(e.target.value)
                            }
                            required
                        />

                        <label>Email Address</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={customerEmail}
                            onChange={(e) =>
                                setCustomerEmail(e.target.value)
                            }
                            required
                        />

                        <label>Number of Tickets</label>

                        <input
                            type="number"
                            min="1"
                            max={Math.min(10, selectedMatch.available_seats)}
                            value={tickets}
                            onChange={(e) =>
                                setTickets(Number(e.target.value))
                            }
                            required
                        />

                        <button
                            type="submit"
                            disabled={
                                bookingLoading ||
                                selectedMatch.available_seats < 1
                            }
                        >
                            {bookingLoading ? "Booking..." : "Confirm Booking"}
                        </button>

                        {bookingMessage && (
                            <p className={
                                messageType === "success"
                                    ? "success-message"
                                    : "error-message"
                            }>
                                {bookingMessage}
                            </p>
                        )}

                    </form>

                ) : (

                    <p>
                        Select a match and click Book Tickets
                        to make your booking.
                    </p>

                )}

            </section>

            {/* Contact Section */}
            <footer className="contact" id="contact">

                <h2>IPL Tickets 2026</h2>

                <p>
                    Experience the excitement of IPL cricket!
                </p>

                <p>Contact: support@ipltickets.com</p>

                <p>© 2026 IPL Ticket Booking. All Rights Reserved.</p>

            </footer>
        </div>
    );
}

export default App;
