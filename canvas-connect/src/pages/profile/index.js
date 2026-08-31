import { useEffect } from "react";
import { useRouter } from "next/router";
import { fetchCurrentUser } from "../../api/api"; 

function ProfileIndex() {
    const router = useRouter();

    useEffect(() => {
        async function loadUser() {
        try {
            const data = await fetchCurrentUser();
            if (data) {
            router.replace(`/profile/${data.username}`);
            } else {
            router.replace("/login");
            }
        } catch (err) {
            console.error(err);
            router.replace("/login");
        }
        }

        loadUser();
    }, []);

    return null;
}

export default ProfileIndex;
