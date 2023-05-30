import DetailUser from './Detail/DetailUser';
import Team from './Team/Team';

import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Suspense } from 'react';


import AuthService from "./services/auth.service";

import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import BoardUser from "./Components/BoardUser";
import BoardModerator from "./Components/BoardModerator";
import BoardAdmin from "./Components/BoardAdmin";
import Setting from './pages/Setting'; 
import EventBus from "./common/EventBus";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import "./App.css";
import ResetPassword from './Components/ResetPassword';

const queryClient = new QueryClient({});

const App = () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <Suspense fallback="...is loading">
    <QueryClientProvider client={queryClient}>
    <div className='container'>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <span className="navbar-brand">
          Employees Manager
        </span>
        <div className="navbar-nav mr-auto">

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link to={`/profile/user/${currentUser.id}`} className="nav-link">
                User
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <DropdownButton id="dropdown-basic-button" title="">
            <Dropdown.Item href={`/profile/user/${currentUser.id}`}>{currentUser.username}'s profile</Dropdown.Item>
            <Dropdown.Item href="/setting" ><img src='/Gear.svg' alt='logoutIcon'></img> Setting</Dropdown.Item>
            <Dropdown.Item href="/login" onClick={logOut}><img src='/LogOutIcon.svg' alt='logoutIcon'></img> LogOut</Dropdown.Item>
          </DropdownButton>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}

      </nav>

      <div className="container  " style={{
        backgroundColor: '#f1f1f1',  height: '100vh'

      }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/user/:id" Component={Profile} />
          <Route path="/user" element={<BoardUser />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/setting" element={<Setting />} />
          {/* <Route path="/mod" element={<BoardModerator />} /> */}
          <Route path="/admin" element={<BoardAdmin />} />
          <Route exact path='/team' element={<Team />} />

          <Route exact path='/detail/user/:id' Component={DetailUser} />
        </Routes>
      </div>
    </div>
    <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </Suspense>
  );
};

export default App;



