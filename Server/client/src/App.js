import React, { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import Navbar from './components/navbar';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screens/home';
import Profile from './components/screens/Profile';
import SignUp from './components/screens/signup';
import Login from './components/screens/Login';
import CreatePost from './components/screens/createPost';
import UserProfile from './components/screens/userProfile';
import { reducer, initialState } from './reducers/userReducer';
import SubscribeUserPost from './components/screens/SubscribUserPost';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword'
import Verify from './components/screens/Verify';
export const UserContext = createContext();

const Routing = () => {
  const History = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      const check = History.location.pathname.startsWith("/signup") || History.location.pathname.startsWith("/reset") || History.location.pathname.startsWith("/signin") || History.location.pathname.startsWith("/verify");
      if (check) {
        History.push("/");
      }
    } else {
      const check = History.location.pathname.startsWith("/signup") || History.location.pathname.startsWith("/reset") || History.location.pathname.startsWith("/signin") || History.location.pathname.startsWith("/verify");
      if (History.location.pathname === "/confirmation" || !check) {
        History.push("/signin");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Login />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/createPost">
        <CreatePost />
      </Route>
      <Route path="/user/:userid">
        < UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        < SubscribeUserPost />
      </Route>
      <Route exact path="/reset">
        < Reset />
      </Route>
      <Route path="/reset/:token">
        < NewPassword />
      </Route>
      <Route path="/verify/:id">
        < Verify />
      </Route>
    </Switch>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
