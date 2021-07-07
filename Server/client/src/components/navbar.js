import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import M from 'materialize-css'
const NavBar = () => {
    const searchModal = useRef(null);
    const [search, setSearch] = useState('');
    const { state, dispatch } = useContext(UserContext);
    const [userDetails, setUserDetails] = useState([]);
    const history = useHistory();
    useEffect(() => {
        M.Modal.init(searchModal.current);
    }, [])
    const renderList = () => {
        if (state) {
            return [
                <li key="1"><i data-target="modal1" className=" modal-trigger material-icons" style={{ color: "black" }}>search</i></li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/createPost">Create Post</Link></li>,
                <li key="4"><Link to="/myfollowingpost">My Following Posts</Link></li>,
                <li key="5">
                    <button className="btn waves-effect waves-light red lighten-2" name="action" onClick={() => {
                        localStorage.clear();
                        dispatch({ type: "CLEAR" });
                        history.push('/signin');
                    }
                    } > Logout</button>
                </li>
            ]
        }
        else {
            return [
                <li key="6"><Link to="/signin">SignIn</Link></li>,
                <li key="7"><Link to="/signup">SignUp</Link></li>
            ]
        }
    }


    const fetchUsers = (query) => {
        setSearch(query);
        fetch('/search-users', {
            method: "post",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                query
            })
        })
            .then(res => res.json())
            .then(result => {
                setUserDetails(result.user);
            });
    }

    return (
        <nav className="white">
            <div className="nav-wrapper white" style={{ maxWidth: "950px", margin: "0px auto" }}>
                <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-content">

                    <input type="text" name="" placeholder="Search Profile" value={search} onChange={(e) => fetchUsers(e.target.value)} />
                    <ul className="collection" style={{ display: "flex", flexDirection: "column" }}>
                        {
                            userDetails.map(item => {
                                return <Link key={item._id} to={(item._id === state._id) ? `/profile` : `/user/${item._id}`} onClick={() => {
                                    M.Modal.getInstance(searchModal.current).close();
                                    setSearch('');
                                }}><li className="collection-item">{item.email}</li></Link>
                            })
                        }
                    </ul>

                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => {
                        M.Modal.getInstance(searchModal.current).close();
                        setSearch('')
                    }}>close</button>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;