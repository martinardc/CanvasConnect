const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(name, username, email, password) {
    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                username,
                email,
                password,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.detail || "Registration failed.",
            };
        }

        return {
            success: true,
            data,
        };
    } catch (err) {
        return {
            success: false,
            message: "Something went wrong. Please try again later.",
        };
    }
}

export async function loginUser(usernameOrEmail, password) {
    try {
        const body = usernameOrEmail.includes("@")
            ? { email: usernameOrEmail, password }
            : { username: usernameOrEmail, password };

        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.detail || "Login failed.",
            };
        }

        return {
            success: true,
            token: data.token,
        };
    } catch (err) {
        return {
            success: false,
            message: "Something went wrong. Please try again later.",
        };
    }
}

export async function fetchCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch(`${API_URL}/username`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });


    if (!res.ok) return null;
    return await res.json();
}


export async function updateProfile(profileData) {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const res = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
    });

    return await res.json();
}

export async function fetchCurrentUserDetails() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch(`${API_URL}/settings/edit-profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) return null;
    return await res.json();
}

export async function changePassword(oldPw, newPw) {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${API_URL}/settings/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                old_password: oldPw,
                new_password: newPw,
            }),
        });

        const data = await res.json();
        if (!res.ok) {
            return {
                success: false,
                message: data.detail || "Failed to change password",
            };
        }
        return {
            success: true,
            message: data.message || "Password updated successfully",
        };
    } catch (err) {
        return {
            success: false,
            message: "Something went wrong. Please try again later.",
        };
    }
}

export async function uploadProfilePicture(file, token) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_URL}/upload-profile-pic`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.detail || "Failed to upload profile picture.",
            };
        }

        return {
            success: true,
            message: data.message || "Profile picture updated successfully.",
            filePath: data.file_path,
        };
    } catch (err) {
        return {
            success: false,
            message: "Something went wrong. Please try again later.",
        };
    }
}

export async function fetchUserByUsername(username) {
    const res = await fetch(`${API_URL}/users/${username}`);
    if (!res.ok) return null;
    return await res.json();
}

export async function uploadWork(file, title, categories, description, price, token) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category", JSON.stringify(categories));
    if (description) formData.append("description", description);
    if (price !== null) formData.append("price", price);

    try {
        const res = await fetch(`${API_URL}/upload-works`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.detail || "Upload failed." };
        }
        return { success: true, message: data.message || "Work uploaded successfully!" };
    } catch (err) {
        return { success: false, message: "Something went wrong. Please try again later." };
    }
}

export async function fetchWorksByUsername(username) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(
            `${API_URL}/works-by-user?username=${encodeURIComponent(username)}`,
            {
                headers: token
                    ? {
                        Authorization: `Bearer ${token}`,
                    }
                    : {},
            }
        );

        if (!res.ok) {
            throw new Error(`Error fetching works: ${res.statusText}`);
        }

        const data = await res.json();
        return data.works;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function deleteWork(workId, token) {
    try {
        const res = await fetch(`${API_URL}/works/${workId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.detail || "Failed to delete work");
        }
        return { success: true };
    } catch (error) {
        console.error("Delete work error:", error);
        return { success: false, message: error.message };
    }
}

export async function fetchWorkById(workId) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/works/${workId}`, {
            headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {},
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
export async function fetchWorksList(limit) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/works?limit=${limit}`, {
        headers: token ? {
            Authorization: `Bearer ${token}`
        } : {},
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.works;
}



export async function likeWork(workId, token) {
    try {
        const res = await fetch(`${API_URL}/works/${workId}/like`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.detail || "Failed to like work.",
            };
        }

        return {
            success: true,
            liked: data.liked,
            message: data.message || "Liked succesfully.",
        };
    } catch (err) {
        return {
            success: false,
            message: "Something went wrong. Please try again later.",
        };
    }

}

export async function searchAll(query) {
    if (!query.trim()) return { users: [], works: [] };
    try {
        const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) return { users: [], works: [] };
        return await res.json();
    } catch (err) {
        console.error("Search error:", err);
        return { users: [], works: [] };
    }
}

export async function fetchWorksByCat(category) {
    const url = category
        ? `${API_URL}/works?category=${encodeURIComponent(category)}`
        : `${API_URL}/works`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.works;
}

export async function fetchGalleries() {
    const res = await fetch(`${API_URL}/galleries`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.galleries;
}

export async function fetchGalleryById(galleryId) {
    const res = await fetch(`${API_URL}/galleries/${galleryId}`);
    if (!res.ok) return null;
    return await res.json();
}

export async function fetchCompetitions() {
    const res = await fetch(`${API_URL}/competitions`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.competitions;
}

export async function fetchCompetitionById(competitionId) {
    const res = await fetch(`${API_URL}/competitions/${competitionId}`);
    if (!res.ok) return null;
    return await res.json();
}

export async function fetchCompetitionEntriesByUser(competitionId, token) {
    const res = await fetch(
        `${API_URL}/competitions/${competitionId}/my-entries`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        return [];
    }

    const data = await res.json();
    return data.entries;
}

export async function enterCompetition(competitionId, workId, token) {
    const res = await fetch(
        `${API_URL}/competitions/${competitionId}/enter?work_id=${encodeURIComponent(workId)}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await res.json();

    if (!res.ok) {
        return { success: false, message: data.detail || "Failed to enter competition." };
    }
    return { success: true, message: data.message || "Entered successfully!" };
}

export async function purchaseWork(workId, token) {
    try {
        const res = await fetch(`${API_URL}/works/${workId}/buy`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.detail || "Purchase failed." };
        }
        return { success: true, message: data.message || "Purchase successful!" };
    } catch (err) {
        return { success: false, message: "Something went wrong. Please try again later." };
    }
}

export async function postComment(workId, text, token) {
    try {
        const formData = new FormData();
        formData.append("text", text);

        const res = await fetch(`${API_URL}/works/${workId}/comment`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.detail || "Failed to post comment." };
        }
        return { success: true, comment: data.comment };
    } catch (err) {
        return { success: false, message: "Something went wrong. Please try again later." };
    }
}

export async function deleteComment(commentId, token) {
    try {
        const res = await fetch(`${API_URL}/comments/${commentId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.detail || "Failed to delete comment");
        }
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function fetchComments(workId) {
    const res = await fetch(`${API_URL}/works/${workId}/comments`);
    if (!res.ok) return [];
    return await res.json();
}