import * as React from 'react';

import '../Styles/Header.css'
import { NavLink } from 'react-router-dom';
// import { Button } from 'react-bootstrap';
import AuthService from '../services/auth.service';


function Header() {
    const currentUser = AuthService.getCurrentUser();
    return (
        <>
            <div className="Container-header">
                <h2 className='header'>Employees Manager</h2>
                <div className='btn-header'>
                    {currentUser?.roles.includes("ROLE_ADMIN") &&
                        <NavLink to={"/admin"} activeclassname="active" className="btn btn-outline-primary">
                            Employee
                        </NavLink>
                    }
                     <NavLink to={currentUser?`/profile/user/${currentUser.id}`:'/login'} activeclassname="active" className="btn btn-outline-primary">
                            User
                        </NavLink>
                    <NavLink to={"/team"} activeclassname="active" className="btn btn-outline-primary">
                        Team
                    </NavLink>
                </div>
            </div>


        </>
    );

}

export default Header;