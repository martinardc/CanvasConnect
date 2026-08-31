import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchWorkById, likeWork } from '../../../api/api';
import "./style.css";
import Comments from '../../../components/Comments/Comments';

export default function WorkDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    const [work, setWork] = useState(null);
    const [token, setToken] = useState(null);
    const [animateLike, setAnimateLike] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleLike = async () => {
        if (!token) {
            console.error("You must be logged in to like a work.");
            return;
        }

        const result = await likeWork(work._id, token);

        if (!result.success) {
            console.error(result.message);
            return;
        }

        setWork((prev) => ({
            ...prev,
            is_liked: !prev.is_liked,
            likes_count: prev.is_liked
                ? Math.max(0, (prev.likes_count || 0) - 1)
                : (prev.likes_count || 0) + 1,
        }));

        setAnimateLike(true);

        setTimeout(() => {
            setAnimateLike(false);
        }, 300);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"));
        }

        if (!id) return;

        async function fetchData() {
            const workData = await fetchWorkById(id);
            setWork(workData);
        }

        fetchData();
    }, [id]);

    if (!work) {
        return <p className="loading-page">Loading...</p>;
    }

    return (
    <div className="work-detail-container">
        <div className="image-wrapper">
            <img
                src={`${API_URL}/${work.file_path}`}
                alt={work.title}
                className="work-image"
            />
            <div className="uploaded-date">
                {new Date(work.uploaded_at).toLocaleDateString()}
            </div>
        </div>

        <div className="work-details">
            <h3 className="work-title">{work.title}</h3>
            {work.description && (
                <p className="work-description">{work.description}</p>
            )}
            <a href={`/profile/${work.username}`} className='work-username'>@{work.username}</a>
            <p className='work-categories'>
                {Array.isArray(work.category)
                ? work.category.map((c, idx) => (
                    <p key={idx} className="work-category">{c}</p>
                    ))
                : <p className="work-category">{work.category}</p>
                }
            </p>
        

            <div className="like-and-comment">
                <button id="like-btn" className="like-and-cmt-btn"
                            onClick={() => handleLike(work._id)}
                        >
                            <img src={work.is_liked ? "/assets/favorite_red_64.svg"
                            : "/assets/favorite_24.svg"} className={animateLike ? "like-pop" 
                                : "heart-icon"} alt="like" />

                </button>
                <span id="likes-count-no" style={{display: work.likes_count > 0 ? "" : "none"}}>
                    {work.likes_count}
                </span>
            </div>
            <Comments workId={work._id} />
        </div>
    </div>
    );

}
