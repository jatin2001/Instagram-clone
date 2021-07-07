import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
const SignUp = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const history = useHistory();
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);
    useEffect(() => {
        if (url) {
            uploadField();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])
    const uploadPic = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "instagram-clone2001");
        fetch("	https://api.cloudinary.com/v1_1/instagram-clone2001/image/upload", { method: "post", body: data })
            .then(res => res.json())
            .then(data => {
                setUrl(data.secure_url);
            })
            .catch(err => console.log(err))

    }
    const uploadField = () => {
        //eslint-disable-next-line
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            return M.toast({ html: "Enter Valid Email", classes: "red darken-3" });
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            M.toast({ html: "Password must contain 6 characters, atleast one uppercase, lowercase, number and special character", classes: "#c62828 red darken-3" });
            return;
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "red darken-3" })
                }
                else {
                    M.toast({ html: data.message, classes: "green darken-3" });
                    setName("");
                    setEmail("");
                    setPassword("");
                    history.push("/signin");
                }
            })
            .catch(err => console.log(err));
    }
    const PostData = () => {
        if (image) {
            uploadPic();
        }
        else uploadField();
    }
    return (
        <div className="mycard">
            <div className="card auth-card">

                <h2 className="logo">Instagram</h2>
                <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" name="" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="file-field input-field">
                    <div className="btn blue lighten-2">
                        <span >Upload Pic</span>
                        <input type="file" onChange={e => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light blue lighten-2" type="submit" name="action" onClick={() => PostData()}>SIGNUP</button>
                <h5>
                    <Link to="/signin">Already have an account</Link>
                </h5>

            </div>
        </div>
    )
}
export default SignUp;