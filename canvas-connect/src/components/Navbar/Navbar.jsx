"use client";

import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { searchAll } from "../../api/api";
import Link from "next/link";

function Navbar({ toggleSidebar, isExpanded }) {
    const [showCategories, setShowCategories] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ users: [], works: [] });
    const searchInputRef = useRef(null);
    const debounceRef = useRef(null);


    const categories = [
        "digital art", "traditional art", "abstract art", "portraiture",
        "landscape", "still life", "calligraphy", "fanart", "photography"
    ];

    const toggleCategories = () => {
        setShowCategories(!showCategories);
    };


    useEffect(() => {
        if (isExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isExpanded]);


    useEffect(() => {
        if (!isExpanded) {
            setQuery("");
            setResults({ users: [], works: [] });
        }
    }, [isExpanded]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!value.trim()) {
            setResults({ users: [], works: [] });
            return;
        }

        debounceRef.current = setTimeout(async () => {
            const data = await searchAll(value);
            setResults(data);
        }, 300);
    };

    const navItems = [
        { href: "/homepage", icon: "/assets/home_41.png", label: "HOME" },
        { href: "/gallery", icon: "/assets/gallery.svg", label: "GALLERY" },
        { href: "/competition", icon: "/assets/competition.svg", label: "COMPETITION" },
    ];

    const hasResults = results.users.length > 0 || results.works.length > 0;

    return (
        <div className="navbar-list">
            <div className="navbar-toggle">
                <img
                    onClick={toggleSidebar}
                    src="/assets/hide_sidebar.png"
                    className="hide-navbar"
                    alt="hide-sidebar-icon"
                />
            </div>

            <div className="logo-img">
                <img src="/assets/logo3.png" alt="logo" />
            </div>

            <div className="list-of-contents">
                <ul style={{ marginLeft: 0 + "px" }}>
                    {navItems.map((item, idx) => (
                        <li key={idx} className="tooltip">
                            <a href={item.href} className="icon-text-content">
                                <img src={item.icon} alt={item.label} className="navbar-icons" />
                                {isExpanded && <span>{item.label}</span>}
                            </a>
                            {!isExpanded && <span className="tooltip-text-navbar">{item.label}</span>}
                        </li>
                    ))}
                    {isExpanded ? (
                        <div className="search-wrapper">
                            <input
                                type="text"
                                id="searchbar"
                                placeholder="Search art, artists..."
                                ref={searchInputRef}
                                value={query}
                                onChange={handleSearchChange}
                            />
                            {hasResults && (
                                <div className="search-dropdown">
                                    {results.users.length > 0 && (
                                        <div className="search-section">
                                            {results.users.map((u) => (
                                                <a
                                                    key={u.username}
                                                    href={`/profile/${u.username}`}
                                                    className="search-result-item"
                                                >
                                                    {u.display_name} @{u.username}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                    {results.works.length > 0 && (
                                        <div className="search-section">
                                            {results.works.map((w) => (
                                                <a
                                                    key={w._id}
                                                    href={`/profile/work/${w._id}`}
                                                    className="search-result-item"
                                                >
                                                    <span className="result-title">{w.title}</span>{" "}
                                                    <span className="result-username">by {w.username}</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <img
                            src="/assets/search_40.svg"
                            alt="search"
                            id="search-icon"
                            onClick={toggleSidebar}
                            style={{ width: 30 + "px", paddingRight: 10 + "px", paddingBottom: 10 + "px", overflow: "hidden" }}
                        />
                    )}

                    <li className="category-toggle tooltip" onClick={toggleCategories}>
                        <div className="icon-text-content">
                            <img
                                onClick={() => {
                                    if (!isExpanded) toggleSidebar();
                                    toggleCategories();
                                }}
                                src="/assets/categories.svg"
                                alt="categories"
                                className="navbar-icons"
                            />
                            {isExpanded && <span>CATEGORIES</span>}
                        </div>
                        {!isExpanded && <span className="tooltip-text-navbar">CATEGORIES</span>}
                    </li>

                    {isExpanded && (
                        <ul className={showCategories ? "category-list show" : "category-list"}>
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <Link href={`/works?category=${encodeURIComponent(cat)}`}>{cat}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Navbar;
