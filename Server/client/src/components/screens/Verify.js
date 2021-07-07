import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';
const NewPassword = () => {
    const history = useHistory();
    const { id } = useParams();
    const PostData = () => {

        fetch("/verify", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id
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

                <button className="btn waves-effect waves-light blue lighten-2" type="submit" name="action" onClick={() => PostData()} > Verify</button>
            </div>

        </div>
    )
}

export default NewPassword;