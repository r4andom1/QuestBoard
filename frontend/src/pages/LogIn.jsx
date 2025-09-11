import {useState, useEffect} from "react"

function LogIn() {
    const [login, SetLogin] = useState("");

    function handleLogin(event) {
        event.preventDefault();
        alert("pressed login")
        SetLogin("");
    }

    return (
        <div className="login">
            <h1>Log in</h1>
            <p>Please enter your information to log in</p>
            <br></br>

            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="text"
                    placeholder="username"
                    className="login-input"
                    value={""} // let the user change this
                />
            </form>
        </div>
    )
}

export default LogIn