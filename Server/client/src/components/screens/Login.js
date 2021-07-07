import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../../App';
const Login = () => {
    const { state, dispatch } = useContext(UserContext);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const history = useHistory();
    const PostData = () => {
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            return M.toast({ html: "Invalid Email", classes: "red darken-3" });
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "red darken-3" })
                }
                else {
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user));
                    console.log(data.user);
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "Signed In Successfully", classes: "green darken-3" });
                    setEmail("");
                    setPassword("");
                    history.push("/");
                }
            })
            .catch(err => console.log(err));
    }
    return (
        <div className="mycard">

            <div className="card auth-card">
                <h2 className="logo">Instagram</h2>
                <input type="text" name="" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button className="btn waves-effect waves-light blue lighten-2" type="submit" name="action" onClick={() => PostData()} > Login</button>
                <h5><Link to="/signup">Dont have an account?</Link></h5>
                <h6><Link to="/reset">Forgot Password?</Link></h6>
            </div>

        </div>
    )
}

export default Login;