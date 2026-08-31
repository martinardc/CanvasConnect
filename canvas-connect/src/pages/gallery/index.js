import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchGalleries } from "../../api/api";
import "./style.css"

export default function GalleryListPage() {
    const [galleries, setGalleries] = useState([]);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchGalleries().then(setGalleries);
    }, []);

    return (
        <div className="gallery-page">
            <h2 className="main-title">Galleries</h2>
            <div>
                {galleries.length === 0 && <p>No galleries yet.</p>}
                <div className="gallery-list">
                    {galleries.map((g) => (
                        <div className="gallery-card">
                            <Link key={g._id} href={`/gallery/${g._id}`} className="gallery-list-link">
                            <div className="gallery-preview-images">
                                {g.preview_works.map((w) => (
                                    <img
                                        key={w._id}
                                        src={`${API_URL}/${w.file_path}`}
                                        alt={w.title}
                                        className="gallery-preview-thumb"
                                    />
                                ))}
                            </div>
                            <h2 className="gallery-title">{g.title}</h2>
                            {g.description && <p className="gallery-description"> {" > "+g.description}</p>} 
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        
        </div>
    );
    }