import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const history = useHistory();

    useEffect(() => {
        if (url) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title, body, pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: "red darken-3" })
                    }
                    else {
                        M.toast({ html: "Created Post Succesfully", classes: "green darken -3" });
                        history.push('/');
                    }

                })
                .catch(err => console.log(err));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [url])
    const postDetails = () => {

        const data = new FormData();
        if (!image) {
            M.toast({ html: "Please Enter All Fields" });
        }
        else {
            data.append("file", image);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "instagram-clone2001");
            fetch("	https://api.cloudinary.com/v1_1/instagram-clone2001/image/upload", { method: "post", body: data })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setUrl(data.secure_url);
                })
                .catch(err => console.log(err))
        }

    }
    return (
        <div className="card input-filled" style={{ margin: "10px auto", maxWidth: "500px", padding: "20px", textAlign: "center" }}>
            <input type="text" name="" placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
            <input type="text" name="" id="" placeholder="body" value={body} onChange={e => setBody(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn blue lighten-2">
                    <span >File</span>
                    <input type="file" onChange={e => setImage(e.target.files[0])} required />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light blue lighten-2" type="submit" name="action" onClick={() => postDetails()}>Submit Post</button>

        </div>
    )
}
export default CreatePost;