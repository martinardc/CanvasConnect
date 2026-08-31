import { useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import "../style.css";
import Settings from "../../../components/Settings/Settings";
import { changePassword } from "../../../api/api";
import "./password.css";

function ChangePasswordPage() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const result = await changePassword(oldPassword, newPassword);

        if (result.success) {
            setIsError(false);
            setMessage(result.message);
            setOldPassword("");
            setNewPassword("");
        } else {
            setIsError(true);
            setMessage(result.message);
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
                        <h2>Change Password</h2>
                        <div className="edit-form">
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Old Password:
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                    />
                                </label>

                                <label>
                                    New Password:
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </label>
                                {message && (
                                    <p className={isError ? "error-msg" : "success-msg"}>{message}</p>
                                )}
                                <div className="btn-group">
                                    <button className="save-btn" type="submit">
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => {
                                            setOldPassword("");
                                            setNewPassword("");
                                            setMessage("");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>


                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordPage;
