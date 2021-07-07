import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import M from 'materialize-css';
const Profile = () => {
    const [myPic, setPics] = useState([]);
    const [image, setImage] = useState("");
    const { state, dispatch } = useContext(UserContext);
    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result.posts);
                setPics(result.posts);
            })
    }, [])
    useEffect(() => {
        if (image) {
            M.toast({ html: "Be patient! This will take some time...", classes: "#546e7a blue-grey darken-1" });
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "instagram-clone2001");
            fetch("	https://api.cloudinary.com/v1_1/instagram-clone2001/image/upload", { method: "post", body: data })
                .then(res => res.json())
                .then(data => {
                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt"),
                        },
                        body: JSON.stringify({
                            pic: data.secure_url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })
                            console.log(result);
                        })

                })
                .catch(err => console.log(err))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image])
    const updatePhoto = (file) => {
        setImage(file);
    }
    return (
        <div style={{ maxWidth: "800px", margin: "0px auto" }}>
            <div style={{ padding: "50px 0px 15px 0px", borderBottom: "1px solid grey" }}>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div>
                        <img src={state ? state.pic : "Loading"} alt="" style={{ height: "160px", width: "160px", borderRadius: "80px" }} />
                    </div>
                    <div style={{ marginLeft: "55px" }}>
                        <h4>{state && state.name}</h4>
                        <h5>{state && state.email}</h5>
                        <div style={{ width: "110%", display: "flex", justifyContent: "space-between" }}>
                            <h6>{myPic.length}posts</h6>
                            <h6>{state ? (state.followers ? state.followers.length : "0") : "0"} followers</h6>
                            <h6>{state ? (state.followers ? state.following.length : "0") : "0"} following</h6>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field" style={{ margin: "25px auto", width: "70%", }}>
                    <div className="btn blue lighten-2">
                        <span >Update Pic</span>
                        <input type="file" onChange={e => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Profile Picture" />
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    myPic.map((item) => {
                        return (
                            <img key={item._id} src={item.photo} className="item" alt={item.title} />
                        )
                    })
                }
            </div>

        </div >
    )
}
export default Profile;