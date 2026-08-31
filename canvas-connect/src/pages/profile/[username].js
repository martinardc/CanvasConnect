import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar/Navbar";
import UploadForm from "../../components/UploadForm/UploadForm";
import "./style.css";
import { fetchCurrentUserDetails, fetchUserByUsername, fetchCurrentUser, fetchWorksByUsername, deleteWork, likeWork } from "../../api/api";
import Link from 'next/link';
import UploadedWorks from "../../components/UploadedWorks/UploadedWorks";


function ProfilePage() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [uploadPopUp, setUploadPopUp] = useState(false);
    const [uploadClicked, setUploadClicked] = useState(false);
    const [works, setWorks] = useState([]);
    const [token, setToken] = useState(null);
    const [selectedWork, setSelectedWork] = useState(null)
    const [animateLike, setAnimateLike] = useState(false);
    
    const router = useRouter();
    const { username } = router.query;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleWorkClick = (workId) => {
        window.location.href = `/profile/work/${workId}`;
    };

    const handleLike = async(workId) => {
        const result = await likeWork(workId, token);

        if (!result.success) {
            console.error(result.message);
            return;
        }


        setWorks((prev) =>
            prev.map((work) =>
                    work._id === workId
                    ? {
                        ...work,
                        is_liked: !work.is_liked,
                        likes_count: work.is_liked
                            ? Math.max(0, (work.likes_count || 0) - 1)
                            : (work.likes_count || 0) + 1,
                        
                        }
                    : work
            )
            
        );
            

    };

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"));
        }
        async function fetchData() {
            const loggedInUser = await fetchCurrentUserDetails();
            const loggedInUsername = await fetchCurrentUser();
            setCurrentUser(loggedInUser);
            if (!username) {
                setUser(null);
                setIsOwnProfile(false);
                return;
            }

            if (loggedInUsername?.username?.toLowerCase() === username.toLowerCase()) {
                setUser(loggedInUser);
                setIsOwnProfile(true);
            } else {
                const otherUser = await fetchUserByUsername(username);
                if (otherUser) setUser(otherUser);
                setIsOwnProfile(false);
            }
            const userWorks = await fetchWorksByUsername(username);
            setWorks(userWorks);
        }
        
        fetchData();
    }, [username]);
    const handleDelete = async (workId) => {
        if (!token) {
            alert("You must be logged in to delete a work");
            return;
        }
        const confirmed = window.confirm("Are you sure you want to delete this work?");
        if (!confirmed) return;

        const result = await deleteWork(workId, token);
        if (result.success) {
            setWorks((prevWorks) => prevWorks.filter((w) => w._id !== workId));
        } else {
            alert(result.message || "Failed to delete work");
        }
    };
    if (!user) return <p className="loading-page">Loading...</p>;

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

        <div className={`profilepage-container ${showSidebar ? "sidebar-open" : ""}`}>
            <div className={`sidebar-left ${showSidebar ? "expanded" : "collapsed"}`}>
            <Navbar toggleSidebar={toggleSidebar} isExpanded={showSidebar} />
            </div>

            <div className="main-editpage">
            <div className="profile-container">
                <div className="profile-info">
                <div className="pfp-username-group">
                    <img
                    src={user?.profile_picture ? `${API_URL}${user.profile_picture}` : "/assets/default-pfp.jpg"}
                    alt="profile"
                    className="profile-pic"
                    />
                    <div className="dn-username-group">
                    <h3>{user?.display_name}</h3>
                    <p>@{username}</p>
                    </div>

                    {isOwnProfile && (
                    <>
                        <button className="edit-btn" onClick={() => window.location.replace("/settings")}>
                        Edit
                        </button>

                    </>
                    )}
                </div>

                <div className="about-me">
                    <p>{user?.bio}</p>
                </div>

                {user?.link && (
                    <div className="link-group">
                    <img src="/assets/link_24.svg" alt="link-icon" />
                    <p>
                        <a href={user.link} target="_blank" rel="noopener noreferrer">
                        {user.link.replace(/^https?:\/\//, "").replace(/\/$/, "").slice(0, 30)}
                        {user.link.replace(/^https?:\/\//, "").replace(/\/$/, "").length > 30 ? "..." : ""}
                        </a>
                    </p>
                    </div>
                )}
                </div>
            </div>
            </div>
            <div className="profile-content-container">
                {isOwnProfile ? (
                    <div className="title">
                        <h2>Fill in Your Canvas</h2>
                        <div className="upload-wrapper">
                        <img
                            className="upload-icon"
                            src="/assets/add_box_24.svg"
                            alt="upload-icon"
                            onClick={() => setUploadPopUp(!uploadPopUp)}
                        />
                        
                        
                            <div
                            className={`upload-popup ${uploadPopUp ? "is-visible" : ""}`}
                            onClick={() => setUploadClicked(true)}
                            >
                            Upload your Work
                            </div>
                        
                        </div>
                    </div>
                ) : (
                     <div className="title"> 
                        <h2>{user?.display_name || username}'s Canvas</h2>
                        
                    </div>)
                }
                {uploadClicked ? 
                (<div className="upload-works-container">
                    <UploadForm
                        uploadClicked={uploadClicked} 
                        setUploadClicked={setUploadClicked} 
                    />
                </div>) 
                : (<UploadedWorks
                    works={works}
                    API_URL={API_URL}
                    isOwnProfile={isOwnProfile}
                    handleWorkClick={handleWorkClick}
                    handleDelete={handleDelete}
                    selectedWork={selectedWork}
                    setSelectedWork={setSelectedWork}  
                    handleLike={handleLike}   
                    animateLike={animateLike}             
                    />)
                
                }
                

                
                
            </div>
        </div>
        </div>
    );
}

export default ProfilePage;
