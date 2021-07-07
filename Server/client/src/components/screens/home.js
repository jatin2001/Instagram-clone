import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const Home = () => {
    const { state, dispatch } = useContext(UserContext);
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                setData(result.posts);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const likepost = (id) => {
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id === result._id) return result;
                    else return item;
                })
                setData(newData);
            }).catch(err => console.log(err));
    }
    const unlikepost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    console.log(result);
                    if (item._id === result._id) return result;
                    else return item;
                })
                setData(newData);
            }).catch(err => console.log(err));
    }

    const makeComments = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId, text
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    console.log(result);
                    if (item._id === result._id) return result;
                    else return item;
                })
                setData(newData);
            }).catch(error => console.log(error));
    }
    const deletePost = (postID) => {
        fetch(`/deletepost/${postID}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {

                console.log(result);
                const newData = data.filter(item => {
                    return item._id !== result.result._id;
                })
                setData(newData);
            }).catch(err => console.log(err));
    }
    const deleteComments = (postID, comment) => {
        fetch('/deletecomment', {
            method: "put",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postID, comment
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) return result;
                    else return item;
                })
                setData(newData);
            }).catch(err => console.log(err));

    }
    return (
        <div className="home">
            {data.length === 0
                ? <h2 style={{ display: "flex", justifyContent: "center" }} className="loading">No posts available.</h2>
                : data.map((item) => {
                    return (
                        <div key={item._id} className="card home-card">

                            <h5 style={{ padding: "5px", display: "flex", justifyContent: "space-between" }}>
                                <Link style={{ display: "flex" }} to={(item.postedBy._id === state._id) ? '/profile' : `/user/${item.postedBy._id}`}>
                                    <img src={item.postedBy.pic} alt="" style={{ height: "35px", width: "35px", borderRadius: "18px" }} />
                                    <span style={{ marginLeft: "7px", marginTop: "3px" }}>{item.postedBy.name}</span>
                                </Link>
                                {(item.postedBy._id === state._id) && <i className="material-icons" style={{ marginTop: "5px" }} onClick={() => deletePost(item._id)} >delete</i>}
                            </h5>


                            <div className="card-image">
                                <img src={item.photo} alt="" />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }} onClick={() => {
                                    item.likes.includes(state._id) ? unlikepost(item._id) : likepost(item._id)
                                }}>
                                    {item.likes.includes(state._id) ? "favorite" : "favorite_border"}0
                                </i>
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>

                                {
                                    item.comments.map(cmt => {
                                        return (
                                            <div key={cmt._id} style={{ display: "flex", justifyContent: "space-between" }}>
                                                <div>
                                                    <p style={{ fontSize: "16px", wordBreak: "break-all" }}>
                                                        <Link to={(cmt.postedBy._id === state._id) ? '/profile' : `/user/${cmt.postedBy._id}`}><strong>{cmt.postedBy.name} </strong></Link>
                                                        {cmt.text}
                                                    </p>
                                                </div>
                                                {
                                                    (cmt.postedBy._id === state._id) &&
                                                    <div>
                                                        <i className="material-icons" onClick={() => {
                                                            deleteComments(item._id, cmt);
                                                        }
                                                        }>delete</i>
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    makeComments(e.target[0].value, item._id)
                                    e.target[0].value = "";
                                }}>
                                    <input type="text" name="" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home;