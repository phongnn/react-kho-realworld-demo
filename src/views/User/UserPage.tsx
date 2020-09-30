import React from "react"
import {
  useParams,
  Switch,
  Route,
  useRouteMatch,
  NavLink,
} from "react-router-dom"

import UserInfoContainer from "./UserInfoContainer"
import MyArticlesContainer from "./MyArticlesContainer"
import FavoriteArticlesContainer from "./FavoriteArticlesContainer"

function TabBar(props: { basePath: string }) {
  return (
    <div className="articles-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <NavLink to={props.basePath} exact={true} className="nav-link">
            My Articles
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={`${props.basePath}/favorite`} className="nav-link">
            Favorited Articles
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

function UserPage() {
  const { username } = useParams()
  const routeMatch = useRouteMatch()
  return (
    <div className="profile-page">
      <UserInfoContainer username={username} />

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <TabBar basePath={routeMatch.url} />
            <Switch>
              <Route
                path={`${routeMatch.url}/favorite`}
                render={() => <FavoriteArticlesContainer username={username} />}
              />
              <Route
                render={() => <MyArticlesContainer username={username} />}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPage
