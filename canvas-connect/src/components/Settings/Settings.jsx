import { useState, useEffect } from "react";
import "./Settings.css";
import { fetchCurrentUser } from "../../api/api";
import { useRouter } from "next/router";

function Settings() {
    const router = useRouter();
    const [showSidebar, setShowSidebar] = useState(true);
    const [user, setUser] = useState(null);


    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const redirect = (pathname) => {
        router.push(pathname)
    }


    useEffect(() => {
        fetchCurrentUser().then(data => {
            if (data) setUser(data);
        });
    }, []);

    return (
        <div>
            <div className={`editpage-container ${showSidebar ? "sidebar-open" : ""}`}>
                <div className="side-editpage">
                    <h1>Settings</h1>
                    <ul className="settings-list">
                        <li className={router.pathname === "/settings" ? "active" : ""}
                            onClick={() => redirect("/settings")}>Edit Profile</li>
                        <li className={router.pathname === "/settings/password" ? "active" : ""} onClick={() => redirect("/settings/password")}>Change Password</li>
                        <li style={{ borderBottom: 0 + 'px' }} className={router.pathname === "/settings/logout" ? "active" : ""}                                 onClick={function logout() {
                                            localStorage.removeItem("token"); 
                                            
                                            window.location.href = "/login"; 
                                        }}
                        >Logout</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Settings;