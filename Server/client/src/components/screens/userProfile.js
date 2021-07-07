import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom'
const Profile = () => {
    const [profile, setProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    const [showFollow, setShow] = useState(state ? !state.following.includes(userid) : true);
    console.log(userid);
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                setProfile(result);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                dispatch({ type: "UPDATE", payload: { following: result.following, followers: result.followers } })
                localStorage.setItem("user", JSON.stringify(result));
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, result._id]
                        }
                    }
                })
                setShow(false);
            })
    }

    const UnfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                dispatch({ type: "UPDATE", payload: { following: result.following, followers: result.followers } })
                localStorage.setItem("user", JSON.stringify(result));

                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item !== result._id);
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShow(true);
            })
    }
    return (
        <div style={{ maxWidth: "800px", margin: "0px auto" }}>
            {
                profile ?
                    <div>
                        <div style={{ display: "flex", justifyContent: "flex-start", padding: "50px 0px", borderBottom: "1px solid grey" }}>
                            <div>
                                <img src={profile.user.pic} alt="" style={{ height: "160px", width: "160px", borderRadius: "80px" }} />
                            </div>
                            <div style={{ marginLeft: "55px" }}>
                                <h4>{profile ? profile.user.name : "Loading..."}</h4>
                                <h5>{profile ? profile.user.email : "Loading..."}</h5>
                                <div style={{ width: "110%", display: "flex", justifyContent: "space-between" }}>
                                    <h6>{profile ? profile.post.length + " " : "0 "}posts</h6>
                                    <h6>{profile ? profile.user.followers.length + " " : "0"}followers</h6>
                                    <h6>{profile ? profile.user.following.length + " " : "0"}following</h6>
                                </div>
                                <button className="btn waves-effect waves-light blue lighten-2" type="submit" name="action" onClick={() => {
                                    showFollow ? followUser() : UnfollowUser();
                                }}>{showFollow ? "Follow" : "UnFollow"}</button>
                            </div>
                        </div>
                        <div className="gallery">
                            {
                                profile.post.map((item) => {
                                    return (
                                        <img key={item._id} src={item.photo} className="item" alt={item.title} />
                                    )
                                })
                            }
                        </div>
                    </div> :
                    <h1 className="loading">Loading....</h1>

            }
        </div >
    )
}
export default Profile;