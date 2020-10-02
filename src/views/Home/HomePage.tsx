import React from "react"
import { NavLink, useParams, Switch, Route } from "react-router-dom"

import { useUser } from "../__shared__/UserProvider"
import GlobalFeedContainer from "./GlobalFeedContainer"
import YourFeedContainer from "./YourFeedContainer"
import PopularTagsContainer from "./PopularTagsContainer"
import TagViewContainer from "./TagViewContainer"

function Banner() {
  return (
    <div className="banner">
      <div className="container">
        <h1 className="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
  )
}

function TabBar(props: { tag?: string; authenticated: boolean }) {
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <NavLink className="nav-link" to="/" exact={true}>
            Global Feed
          </NavLink>
        </li>
        {props.authenticated && (
          <li className="nav-item">
            <NavLink className="nav-link" to="/feed">
              Your Feed
            </NavLink>
          </li>
        )}
        {props.tag && (
          <li className="nav-item">
            <NavLink className="nav-link" to={`/tags/${props.tag}`}>
              #{props.tag}
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  )
}

function Home() {
  const { tag } = useParams()
  const authenticated = !!useUser()

  return (
    <div className="home-page">
      {!authenticated && <Banner />}
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <TabBar tag={tag} authenticated={authenticated} />
            <Switch>
              <Route
                path="/tags/:tag"
                render={() => <TagViewContainer tag={tag} />}
              />
              {authenticated && (
                <Route path="/feed" component={YourFeedContainer} />
              )}
              <Route component={GlobalFeedContainer} />
            </Switch>
          </div>
          <div className="col-md-3">
            <PopularTagsContainer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
