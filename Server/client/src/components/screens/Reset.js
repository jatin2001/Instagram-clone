import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const Reset = () => {
    const [email, setEmail] = useState("");
    const history = useHistory();
    const PostData = () => {
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            return M.toast({ html: "Invalid Email", classes: "red darken-3" });
        }
        fetch("/reset-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "red darken-3" })
                }
                else {
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
                <input type="text" name="" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button className="btn waves-effect waves-light blue lighten-2" type="submit" name="action" onClick={() => PostData()} > Reset Password</button>
            </div>

        </div>
    )
}

export default Reset;