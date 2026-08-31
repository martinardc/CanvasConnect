import { useState, useEffect } from "react";
import { fetchComments, postComment, deleteComment, fetchCurrentUser } from "../../api/api";
import "./Comments.css"

export default function Comments({ workId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [currentUsername, setCurrentUsername] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchComments(workId).then(setComments);
        fetchCurrentUser().then((u) => {
            if (u) setCurrentUsername(u.username);
        });
    }, [workId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const token = localStorage.getItem("token");
        const result = await postComment(workId, newComment, token);

        if (result.success) {
            setComments((prev) => [result.comment, ...prev]);
            setNewComment("");
            setMessage("");
        } else {
            etMessage(result.message);
        }
    };

    const handleDelete = async (commentId) => {
        const token = localStorage.getItem("token");
        const result = await deleteComment(commentId, token);
        if (result.success) {
            setComments((prev) => prev.filter((c) => c._id !== commentId));
        }
    };

    return (
        <div className="comments-section">
            <h4 className="comments-title">Comments</h4>



            <div className="comments-list-form">
                <div className="comments-list">
                    {comments.length === 0 && <p className="no-comments">No comments yet.</p>}
                    {comments.map((c) => (
                        <div key={c._id} className="comment-item">
                            <div className="comment-text"><strong>{c.username}:</strong> {c.text}</div>

                            {c.username === currentUsername && (
                                <button className="delete-comment-btn" onClick={() => handleDelete(c._id)}>
                                    <img src="/assets/delete_24dp.svg" alt="delete-icon" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {currentUsername && (
                    <form onSubmit={handleSubmit} className="comment-form">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit">Post</button>
                    </form>)}
            </div>
            {message && <p className="comment-error">{message}</p>}
        </div>
    );
}