import "./style.css";
import { useState } from "react";
import { loginUser } from "../../api/api";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginCheck, setLoginCheck] = useState(true);

    async function handleSubmit(e) {
        e.preventDefault();

        const result = await loginUser(username, password);

        if (!result.success) {
            setLoginCheck(false);
            return;
        }

        setLoginCheck(true);

        localStorage.setItem("token", result.token);
        window.location.href = "/homepage";
    }

    return (
        <div className="login-container">
            <div className="wrapper">
                <h2>
                    <img id="logo-img" src="/assets/logo32.png" alt="logo" /> Login
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                        className={!loginCheck ? "red-border" : ""}
                        type="text"
                        placeholder="Username or Email"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setLoginCheck(true);
                        }}
                        required
                        />
                    </div>

                    <div className="input-box">
                        <input className={!loginCheck ? "red-border" : ""}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setLoginCheck(true);
                            }}
                            required
                        />

                        <h3 className={!loginCheck ? "warning-message" : "hide-message"}>
                            Incorrect username/email or password
                        </h3>
                    </div>

                    <div className="input-box button">
                        <input type="submit" value="Login" />
                    </div>

                    <div className="text">
                        <h3>Don't have an account? <a href="/register">Register now</a></h3>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;