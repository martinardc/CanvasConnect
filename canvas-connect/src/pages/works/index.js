"use client";
import { useState, useEffect } from "react";
import { fetchWorksByCat } from "../../api/api";
import { useRouter } from "next/router";
import "./style.css"

export default function WorksPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { category } = router.query;
    const [showSidebar, setShowSidebar] = useState(false);
    const [works, setWorks] = useState([]);
    const toggleSidebar = () => setShowSidebar(!showSidebar);

    useEffect(() => {
        // router.query je prazan objekt na prvi render dok Next ne parsira URL
        // pa ceka da router bude "ready" prije nego zove fetch
        if (!router.isReady) return;

        fetchWorksByCat(category).then(setWorks);
    }, [category, router.isReady]);

    return (
        <div className="page-container">
            <h2 className="category-name">{category ? category : "All works"}</h2>
            <div className="uploaded-works-container">
                <div className="works-grid">

                    {works.map((w) => (
                        <a key={w._id} href={`profile/work/${w._id}`} className="work-item">
                            <div className="image-wrapper">
                                <img
                                    src={`${API_URL}/${w.file_path}`}
                                    alt={w.title}
                                    className="work-image"
                                />
                            </div>
                            <p className="work-title">{w.title}</p>
                            <p className="work-username">@{w.username}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}