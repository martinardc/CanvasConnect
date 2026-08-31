import { useState } from "react";
import { uploadProfilePicture } from "../../api/api";

function ProfilePicUploader() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        setFile(selectedFile);
        setMessage("");

        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("You must be logged in.");
            return;
        }

        const result = await uploadProfilePicture(file, token);

        setMessage(result.message);

        if (result.success) {
            setFile(null);
            setPreviewUrl(null);
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Update Profile Picture</h2>

            {previewUrl && (
                <div style={{ marginBottom: "1rem" }}>
                    <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid #ccc"
                        }}
                    />
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />

            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleUpload}>
                    Upload
                </button>
            </div>

            {message && (
                <p>{message}</p>
            )}
        </div>
    );
}

export default ProfilePicUploader;