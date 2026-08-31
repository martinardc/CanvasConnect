import { useState } from "react";
import { uploadWork } from "../../api/api";
import "./UploadForm.css";
import { useRouter } from "next/router";
import Select from "react-select";

export default function UploadForm({ uploadClicked, setUploadClicked }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [forSale, setForSale] = useState(false);
    const [price, setPrice] = useState("");

    const router = useRouter();
    const token = localStorage.getItem("token");
    const handleCancel = () => {
        setUploadClicked(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title || categories.length === 0) {
            setMessage("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        const result = await uploadWork(
            file,
            title,
            categories.map(category => category.value),
            description,
            forSale ? price : null,
            token
        );
        setLoading(false);

        setMessage(result.message);

        if (result.success) {
            setFile(null);
            setTitle("");
            setCategories([]);
            setDescription("");
            setForSale(false);
            setPrice("");
            router.push("/profile");
        }
    };

    const categoryOptions = [
        { value: "photography", label: "Photography" },
        { value: "traditional art", label: "Traditional Art" },
        { value: "digital art", label: "Digital Art" },
        { value: "portraiture", label: "Portraiture" },
        { value: "landscape", label: "Landscape" },
        { value: "still life", label: "Still Life" },
        { value: "calligraphy", label: "Calligraphy" },
        { value: "fanart", label: "Fanart" },
        { value: "abstract art", label: "Abstract Art" },
        { value: "abstract art", label: "Abstract Art" }
    ];

    const selectStyles = {
        control: (base) => ({
            ...base,

            borderRadius: "8px",
            border: "none",
            outline: "none",
            background: "#2c2c2c62",
            color: "#fff",
        }),
        menu: (base) => ({
            ...base,
            color: "black"
        })
    }

    return (
        <form className="upload-form" onSubmit={handleSubmit}>
            <h2 style={{ color: "white" }}>Upload Your Work</h2>

            <div className="form-group">
                <label>Choose from gallery *</label>
                <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} />
            </div>

            <div className="form-group">
                <label>Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Categories: *</label>
                <Select
                    isMulti
                    options={categoryOptions}
                    value={categories}
                    onChange={setCategories}
                    id="select-categories"
                    styles={selectStyles}
                />
            </div>

            <div className="form-group">
                <label>Description (optional)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        checked={forSale}
                        onChange={(e) => setForSale(e.target.checked)}
                    />
                    {" "}Available for purchase
                </label>
            </div>

            {forSale && (
                <div className="form-group">
                    <label>Price (€) *</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
            )}
            <div className="btn-group">
                <button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>
                <button className="cancel-btn" type="button" onClick={handleCancel}
                    style={{ background: "rgb(209, 97, 97)" }}
                >
                    Cancel
                </button>
            </div>


            {message && <p>{message}</p>}
        </form>
    );
}
