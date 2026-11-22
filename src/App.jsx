
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";
import "./App.css";

function App() {

    const [search, setSearch] = useState("");
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [tickets, setTickets] = useState(1);
    const [bookingMessage, setBookingMessage] = useState("");

    const matches = [
        {
            id: 1,
            team1: "RCB",
            team2: "CSK",
            date: "25 April 2026",
            venue: "Bengaluru"
        },
        {
            id: 2,
            team1: "MI",
            team2: "KKR",
            date: "27 April 2026",
            venue: "Mumbai"
        },
        {
            id: 3,
            team1: "RCB",
            team2: "MI",
            date: "30 April 2026",
            venue: "Bengaluru"
        },
        {
            id: 4,
            team1: "CSK",
            team2: "SRH",
            date: "2 May 2026",
            venue: "Chennai"
        }
    ];

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
    function handleSubmit(event) {
        event.preventDefault();

        setBookingMessage(
            "Thank you, " + customerName +
            "! Your booking request for " +
            selectedMatch.team1 + " vs " +
            selectedMatch.team2 +
            " has been confirmed successfully."
        );
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

                <div className="match-container">

                    {filteredMatches.length > 0 ? (
                        filteredMatches.map((match) => (
                            <MatchCard
                                key={match.id}
                                team1={match.team1}
                                team2={match.team2}
                                date={match.date}
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

                        <p>Date: {selectedMatch.date}</p>

                        <p>Venue: {selectedMatch.venue}</p>

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
                            max="10"
                            value={tickets}
                            onChange={(e) =>
                                setTickets(Number(e.target.value))
                            }
                            required
                        />

                        <button type="submit">
                            Confirm Booking
                        </button>

                        {bookingMessage && (
                            <p className="success-message">
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
