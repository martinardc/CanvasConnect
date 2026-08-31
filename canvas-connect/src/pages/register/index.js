import "./style.css";
import { useState } from "react";
import { registerUser, loginUser } from "../../api/api";

function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usernameCheck, setUsernameCheck] = useState(true)
    const [passwordCheck, setPasswordCheck] = useState(true)
    const [emailCheck, setEmailCheck] = useState(true);

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordCheck(false);
            return;
        }

        setPasswordCheck(true);

        const registerResult = await registerUser(
        name,
        username,
        email,
        password);

        if (!registerResult.success) {
            if (registerResult.message === "Username already exists") {
                setUsernameCheck(false);
                setEmailCheck(true);
            } 
            else if (registerResult.message === "Email already registered") {
                setEmailCheck(false);
                setUsernameCheck(true);
            } 

            return;
        }

        setUsernameCheck(true);
        setEmailCheck(true);


        const loginResult = await loginUser(username, password);

        if (!loginResult.success) {;
            return;
        }

        localStorage.setItem("token", loginResult.token);
        window.location.href = "/homepage";
    }

    return (
        <div className="register-container">
            <div className="wrapper">
                <h2>
                    <img id="logo-img" src="/assets/logo32.png" alt="logo" /> Register
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                        type="text"
                        placeholder="Enter your name"
                        
                        onChange={(e) => setName(e.target.value)}
                        required
                        />
                    </div>
                    <div className="input-box">
                        <input
                        className={!usernameCheck ? "red-border" : "green-border"}
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setUsernameCheck(true);
                        }}
                        required
                        />
                        <h3 
                        className={!usernameCheck ? "warning-message" : "hide-message"}>
                        {"Username already exists"}
                        </h3>
                    </div>
                    <div className="input-box">
                        <input
                        className={!emailCheck ? "red-border" : ""}
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailCheck(true);
                        }}
                        required
                        />

                        <h3 className={!emailCheck ? "warning-message" : "hide-message"}>
                        {"Email already registered"}
                        </h3>
                    </div>
                    <div className="input-box">
                        <input
                        className={!passwordCheck ? "red-border" : "green-border"}
                        type="password"
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>
                    <div className="input-box">
                        <input
                        className={!passwordCheck ? "red-border" : ""}
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        /> 
                        <h3 className={!passwordCheck ? "warning-message" : "hide-message"}>
                            {"Passwords don't match"}
                        </h3>
                    </div>
                    
                    <div className="policy">
                        <input type="checkbox" required />
                        <h3>I accept all terms & condition</h3>
                    </div>
                    <div className="input-box button">
                        <input type="submit" value="Register" />
                    </div>
                    <div className="text">
                        <h3>Already have an account? <a href="/login">Login now</a></h3>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
