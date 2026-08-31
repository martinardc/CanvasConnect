import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./style.css";
import { fetchCurrentUser, fetchCurrentUserDetails, fetchWorksList } from "../../api/api";


function HomePage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [showSidebar, setShowSidebar] = useState(true);
    const [user, setUser] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [worksList, setWorksList] = useState([]);


    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };


    const openSettings = () => {
        setShowSettings(prev => !prev);
    }
    
    const handleWorkClick = (workId) => {
        window.location.href = `/profile/work/${workId}`;
    };

    

    useEffect(() => {
        fetchCurrentUser().then(data => {
            if (data) setUser(data);
        });
        fetchCurrentUserDetails().then((data) => {
            if (data) setUserDetails(data);
        }, []);
        fetchWorksList(8).then(setWorksList);
    }, []);

    return (
        <div>
            <div className="menu-logo"> 
                <img
                    onClick={toggleSidebar}
                    src="/assets/menu.png"
                    className={showSidebar ? 'view-navbar hide': 'view-navbar' }
                    alt="sidebar-icon"
                />
            </div>

            <div className={`homepage-container ${showSidebar ? "sidebar-open" : ""}`}>
                <div className={`sidebar-left ${showSidebar ? "expanded" : "collapsed"}`}>
                    <Navbar toggleSidebar={toggleSidebar} isExpanded={showSidebar} />
                </div>

                <div className="main-homepage">
                    {user ? <h1>Welcome, {userDetails?.display_name || user?.username}!</h1> : <h1>Welcome!</h1>}
                    <div className="uploaded-works-container">
                        {worksList.length === 0 ? (
                            <p className="no-works-display">No works found.</p>
                        ) : (
                            <div className="works-grid">
                                {worksList.map((work) => (
                                    <div key={work._id} className="work-card">
                                        <div className="image-wrapper"
                                            onClick={() => handleWorkClick(work._id)}>
                                            <img
                                                src={`${API_URL}/${work.file_path}`}
                                                alt={work.title}
                                                className="work-image"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="sidebar-right">
                    <ul id='ul-sidebar'>
                        <li>
                            <a href="/profile">
                                <img src={
                                    userDetails?.profile_picture
                                        ? `${API_URL}${userDetails.profile_picture}`
                                        : "/assets/default-pfp.jpg"
                                    } alt="pfp" className="profile-pic" id="profile-img"/>
                            </a>
                        </li>
                        {user ? <li><a href="/profile" className="profile-click">@{user.username}</a></li> : <li></li>}
                    </ul>
                    <ul id="sidebar-options">
                        <li className="tooltip">
                            <div className="tooltip-trigger"></div>
                        </li>

                        <li className="tooltip">
                            <div className="tooltip-trigger">
                                <img src="/assets/settings_90.png" alt="settings" className="sidebar-icons" onClick={openSettings}/>
                                <span className="tooltip-text">Settings</span>
                            </div>
                            {showSettings && (
                                <div className="settings-popup">
                                    <ul>
                                        <a 
                                        href="/settings"
                                        style={{ textDecoration: "none", color: "black" }}
                                        ><li>Edit Profile</li></a>
                                        <a 
                                        href="/settings/password"
                                        style={{ textDecoration: "none", color: "black" }}
                                        ><li>Change Password</li></a>
                                    </ul>
                                </div>
                            )}
                        </li>

                        <li className="tooltip">
                            <div className="tooltip-trigger">
                                <img src="/assets/logout_90.png" alt="logout" className="sidebar-icons" 
                                onClick={function logout() {
                                            localStorage.removeItem("token"); 
                                            
                                            window.location.href = "/login"; 
                                        }}
                                />
                                <span className="tooltip-text">Logout</span>
                            </div>

                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
