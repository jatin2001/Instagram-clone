import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';
const NewPassword = () => {
    const [password, setPassword] = useState("");
    const history = useHistory();
    const { token } = useParams();
    console.log(token);
    const PostData = () => {
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            M.toast({ html: "Password must contain 6 characters, atleast one uppercase, lowercase, number and special character", classes: "#c62828 red darken-3" });
            return;
        }
        fetch("/new-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                token
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "red darken-3" })
                }
                else {
                    console.log(data.user);
                    M.toast({ html: data.message, classes: "green darken-3" });
                    history.push("/signin");
                }
            })
            .catch(err => console.log(err));
    }
    return (
        <div className="mycard">

            <div className="card auth-card">
                <h2 className="logo">Instagram</h2>
                <input type="password" name="" placeholder="Enter a new password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light blue lighten-2" type="submit" name="action" onClick={() => PostData()} > Update Password</button>
            </div>

        </div>
    )
}

export default NewPassword;