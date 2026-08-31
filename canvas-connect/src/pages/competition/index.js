import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchCompetitions } from "../../api/api";
import "./style.css"

export default function CompetitionListPage() {
    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        fetchCompetitions().then(setCompetitions);
    }, []);

    return (
        <div className="competitions">
            <h2>Themed Competitions</h2>
            <ul className="competition-list">
                {competitions.length === 0 && <p>No competitions yet.</p>}
                {competitions.map((c) => (
                    <Link key={c._id} href={`/competition/${c._id}`} className="competition-card">
                        <li><h3>{c.title}</h3>
                            <p className="competition-theme"><b>Theme:</b> {c.theme}</p>
                            {c.description && <p className="competition-description"> - {c.description}</p>}
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}