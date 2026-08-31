import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchCompetitionById, fetchCurrentUser, fetchWorksByUsername, enterCompetition, fetchCompetitionEntriesByUser } from "../../api/api";
import "./style.css"

export default function CompetitionDetailPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { id } = router.query;
    const [competition, setCompetition] = useState(null);
    const [myWorks, setMyWorks] = useState([]);
    const [myEntries, setMyEntries] = useState([]);
    const [selectedWorkId, setSelectedWorkId] = useState("");
    const [applyMessage, setApplyMessage] = useState("");

    useEffect(() => {
        if (!router.isReady) return;
        fetchCompetitionById(id).then(setCompetition);
    }, [id, router.isReady]);

    useEffect(() => {
        if (!router.isReady) return;
        const token = localStorage.getItem("token");
        if (!token) return;

        fetchCurrentUser().then((user) => {
            if (user) fetchWorksByUsername(user.username).then(setMyWorks);
        });
        fetchCompetitionEntriesByUser(id, token).then(setMyEntries);
    }, [id, router.isReady]);

    const handleApply = async () => {
        if (!selectedWorkId) {
            setApplyMessage("Pick a work first.");
            return;
        }
        const token = localStorage.getItem("token");
        const result = await enterCompetition(id, selectedWorkId, token);
        setApplyMessage(result.message);

        if (result.success) {
            fetchCompetitionEntriesByUser(id, token).then(setMyEntries);
        }
    };

    if (!competition) return <p>Loading...</p>;

    const isOverdue = new Date() > new Date(competition.end_date);

  return (
    <div className="competition-detail">
        <h2>{competition.title}</h2>
        <p>Theme: {competition.theme}</p>
        {competition.description && <p>{competition.description}</p>}

            {myEntries.filter((entry) => entry.status === "pending").length > 0 && (
                <div className="my-entries-section">
                    <h4>Your pending entries:</h4>
                    {myEntries
                        .filter((entry) => entry.status === "pending")
                        .map((entry) => {
                        const work = myWorks.find((w) => w._id === entry.work_id);
                        return (
                            <div key={entry._id} className="entry-status entry-status-pending">
                            <a href={`/profile/work/${entry.work_id}`}>{work ? work.title : entry.work_id}</a>
                            <span className="status-badge">Pending</span>
                            </div>
                        );
                    })}
                </div>
            )}
        {isOverdue ? (
            <p className="competition-closed">This competition has ended.</p>
        ) : (
            <div className="apply-section">
                <select value={selectedWorkId} onChange={(e) => setSelectedWorkId(e.target.value)}>
                    <option value="">Select one of your works</option>
                        {myWorks.map((w) => (
                            <option key={w._id} value={w._id}>{w.title}</option>
                        ))}
                </select>
                <button onClick={handleApply}>Submit your work</button>
                {applyMessage && <p>{applyMessage}</p>}
            </div>
        )}

        <div className="works-grid">
            {competition.entries.map((w) => (
                <a key={w._id} href={`/profile/work/${w._id}`} className="work-item">
                    <div className="image-wrapper">
                        <img
                            src={`${API_URL}/${w.file_path}`}
                            alt={w.title}
                            className="work-image"
                        />
                    </div>
                    <p className="work-title">{w.title}</p>
                    <p className="work-description">{w.description}</p>
                    <p className="work-username">@{w.username}</p>
                </a>
            ))}
        </div>
    </div>
  );
}