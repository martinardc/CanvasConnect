import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchGalleryById } from "../../api/api";
import "../works/style.css"
import "./style.css"


export default function GalleryDetailPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { id } = router.query;
    const [gallery, setGallery] = useState(null);

    useEffect(() => {
        if (!router.isReady) return;
        fetchGalleryById(id).then(setGallery);
    }, [id, router.isReady]);

    if (!gallery) return <p>Loading...</p>;

    return (
        <div className="page-container">
            <div className="gallery-detail">
            <h2 className="id-gallery-title">{gallery.title}</h2>
            {gallery.description && <p className="id-gallery-description">{gallery.description}</p>}

            <div className="works-grid">
                {gallery.works.map((w) => (
                <a key={w._id} href={`/profile/work/${w._id}`} className="work-item">
                    <div
                        className="image-wrapper"
                        >
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
        </div>
    );
}
