import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./style.css";
import Settings from "../../components/Settings/Settings";
import { fetchCurrentUserDetails } from "../../api/api";

function EditProfilePage() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [token, setToken] = useState(null);
    const [formData, setFormData] = useState({
        profilePic: "",
        bio: "",
        displayName: "",
        birthday: "",
        link: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        const form = new FormData();
        form.append("display_name", formData.displayName);
        form.append("bio", formData.bio);
        form.append("birthday", formData.birthday);
        form.append("link", formData.link);

        if (formData.profilePic instanceof File) {
        form.append("file", formData.profilePic);
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/edit-profile`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: form,
        });

        const data = await res.json();
        if (res.ok) {
        setUser(data.user);
        setEditMode(false);
        setSuccess("Profile updated successfully!");
        setError("");
        } else {
        setError(data.detail || "Error updating profile");
        setSuccess("");
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
        setToken(localStorage.getItem("token"));
        }
        fetchCurrentUserDetails().then((data) => {
        if (data) {
            setUser(data);
            setFormData({
            profilePic: "", 
            bio: data.bio || "",
            displayName: data.display_name || "",
            birthday: data.birthday ? data.birthday.slice(0, 10) : "",
            link: data.link || ""
            });
        }

        });
    }, []);
    
    useEffect(() => {
        if (editMode && user) {
        setFormData({
            profilePic: "",
            bio: user.bio || "",
            displayName: user.display_name || "",
            birthday: user.birthday ? user.birthday.slice(0, 10) : "",
            link: user.link || ""
        });
        setError("");
        setSuccess("");
        }
    }, [editMode, user]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profilePic" && files.length > 0) {
        setFormData({ ...formData, profilePic: files[0] });
        } else {
        setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <div>
            <div className="menu-logo">
                <img
                onClick={toggleSidebar}
                src="/assets/menu.png"
                className={showSidebar ? "view-navbar hide" : "view-navbar"}
                alt="sidebar-icon"
                />
            </div>

            <div className={`editpage-container ${showSidebar ? "sidebar-open" : ""}`}>
                <div className={`sidebar-left ${showSidebar ? "expanded" : "collapsed"}`}>
                    <Navbar toggleSidebar={toggleSidebar} isExpanded={showSidebar} />
                </div>

                <div className="main-editpage">
                    <div className="settings-comp">
                        <Settings />
                    </div>

                    <div className="edit-profile-container">
                        {!editMode ? (
                        <>
                            <h2>Edit Profile</h2>
                            <div className="profile-info">
                            <img
                                src={
                                user?.profile_picture
                                    ? `${API_URL}${user.profile_picture}`
                                    : "/assets/default-pfp.jpg"
                                }
                                alt="profile"
                                className="profile-pic"
                            />
                            <p><b>About:</b> {user?.bio}</p>
                            <p><b>Display Name:</b> {user?.display_name}</p>
                            <p><b>Birthday:</b> {user?.birthday}</p>
                            <p><b>Link:</b> {user?.link}</p>
                            </div>
                            <button className="edit-btn" onClick={() => setEditMode(true)}>
                                Edit
                            </button>
                        </>
                        ) : (
                        <>
                            <h2>Edit Profile</h2>
                            <div className="edit-form">
                                <label>Profile Picture</label>
                                <input type="file" name="profilePic" onChange={handleChange} />

                                <label>About</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows="4"
                                    value={formData.bio}
                                    maxlength ="120"
                                    onChange={handleChange}
                                />

                                <label>Display Name</label>
                                <input
                                    type="text"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                />

                                <label>Birthday</label>
                                <input
                                    type="date"
                                    name="birthday"
                                    value={formData.birthday}
                                    onChange={handleChange}
                                />
                                <label>Link</label>
                                <input
                                    type="str"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                />

                                <div className="btn-group">
                                    <button className="save-btn" onClick={handleSave}>
                                    Save
                                    </button>
                                    <button className="cancel-btn" onClick={() => setEditMode(false)}>
                                    Cancel
                                    </button>
                                </div>
                                {error && <p className="error-msg">{error}</p>}
                                {success && <p className="success-msg">{success}</p>}
                            </div>
                        </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;
