import { useState } from "react";
import { purchaseWork } from "../../api/api"; // prilagodi putanju ako treba
import "./UploadedWorks.css"
import Comments from "../Comments/Comments";

export default function UploadedWorks({
    works,
    API_URL,
    isOwnProfile,
    handleWorkClick,
    handleDelete,
    selectedWork,
    setSelectedWork,
    handleLike,
    animateLike
}) {
    const [purchaseMessage, setPurchaseMessage] = useState({});

    const handlePurchase = async (workId) => {
        const token = localStorage.getItem("token");
        const result = await purchaseWork(workId, token);
        setPurchaseMessage((prev) => ({ ...prev, [workId]: result.message }));
    };

    return (
        <div className="uploaded-works-container">
        {works.length === 0 ? (
            <p className="no-works-display">No works found.</p>
        ) : (
            <div className="works-grid">
            {works.map((work) => (
                
                <div key={work._id} className="work-card">
                <div
                    className="image-wrapper"
                    onClick={() => handleWorkClick(work._id)}
                >
                    <img
                        src={`${API_URL}/${work.file_path}`}
                        alt={work.title}
                        className="work-image"
                    />

                    <div className="uploaded-date">
                        {new Date(work.uploaded_at).toLocaleDateString()}
                    </div>
                </div>

                <h3 className="work-title">{work.title}</h3>

                {work.description && (
                    <p className="work-description">{work.description}</p>
                )}

                <div className="work-categories work-category">
                    {Array.isArray(work.category) ? work.category.join(", ") : work.category}
                </div>

                {work.price != null && (
                    <div className="work-purchase">
                        <span className="work-price">${work.price}</span>
                        {!isOwnProfile && (
                            <button
                                className="purchase-btn"
                                onClick={() => handlePurchase(work._id)}
                            >
                                Purchase
                            </button>
                        )}
                        {purchaseMessage[work._id] && (
                            <p className="purchase-message">{purchaseMessage[work._id]}</p>
                        )}
                    </div>
                )}

                <div className="like-and-comment">
                    <button id="like-btn" className="like-and-cmt-btn"
                        onClick={() => handleLike(work._id)}
                    >
                        <img src={work.is_liked ? "/assets/favorite_red_64.svg"
                        : "/assets/favorite_24.svg"} className={animateLike ? "like-pop" 
                            : "heart-icon"} alt="like" />

                    </button>
                    <span id="likes-count-no" style={{display: work.likes_count > 0 ? "" 
                    : "none"}}>{work.likes_count}</span>
                </div>

                {isOwnProfile && (
                    <button
                    className="delete-btn"
                    onClick={() => handleDelete(work._id)}
                    >
                    <img
                        src="/assets/delete_24dp.svg"
                        alt="delete-icon"
                    />
                    </button>
                )}
                </div>
            ))}
            </div>
        )}

        {selectedWork && (
            <div className="work-details-popup">
            <button onClick={() => setSelectedWork(null)}>
                Close
            </button>

            <h2>{selectedWork.title}</h2>

            <img
                src={`${API_URL}/${selectedWork.file_path}`}
                alt={selectedWork.title}
            />

            <p>{selectedWork.description}</p>

            <p>Category: {selectedWork.category}</p>

            {selectedWork.price != null && (
                <div className="work-purchase">
                <span className="work-price">${selectedWork.price}</span>
                {!isOwnProfile && (
                    <button className="purchase-btn" onClick={() => handlePurchase(selectedWork._id)}>
                    Purchase
                    </button>
                )}
                {purchaseMessage[selectedWork._id] && (
                    <p className="purchase-message">{purchaseMessage[selectedWork._id]}</p>
                )}
                </div>
            )}

            <Comments workId={selectedWork._id} />
            </div>
        )}
        </div>
    );
}