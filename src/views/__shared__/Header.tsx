import React from "react"
import { NavLink, Link } from "react-router-dom"

import { useUser } from "./UserProvider"

function Header() {
  const user = useUser()
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink to="/" exact={true} className="nav-link">
              Home
            </NavLink>
          </li>
          {user && (
            <>
              <li className="nav-item">
                <NavLink to="/post" className="nav-link">
                  <i className="ion-compose"></i>&nbsp;New Post
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/settings" className="nav-link">
                  <i className="ion-gear-a"></i>&nbsp;Settings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={`/users/${user.username}`}>
                  <img src={user.image} className="user-pic" alt="Avatar of" />
                  &nbsp;{user.username}
                </NavLink>
              </li>
            </>
          )}
          {!user && (
            <>
              <li className="nav-item">
                <NavLink to="/signin" className="nav-link">
                  Sign in
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/signup" className="nav-link">
                  Sign up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Header
