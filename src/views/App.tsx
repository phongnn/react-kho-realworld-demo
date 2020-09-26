import React from "react"
import { Switch, Route } from "react-router-dom"

import Header from "./__shared__/Header"
import Footer from "./__shared__/Footer"
import HomePage from "./Home/HomePage"
// import UserPage from "./User/UserPage"
// import ArticleViewContainer from "./Article/ArticleViewContainer"
// import SignUpFormContainer from "./SignUp/SignUpFormContainer"
// import SignInFormContainer from "./SignIn/SignInFormContainer"
// import NewArticleContainer from "./Post/NewArticleContainer"
// import EditArticleContainer from "./Post/EditArticleContainer"
// import SettingsFormContainer from "./Settings/SettingsFormContainer"

function App() {
  return (
    <div>
      <Header />
      <Switch>
        {/* <Route path="/signup" component={SignUpFormContainer} />
        <Route path="/signin" component={SignInFormContainer} />
        <Route path="/articles/:slug" component={ArticleViewContainer} />
        <Route path="/users/:username" component={UserPage} />
        <Route path="/post" component={NewArticleContainer} />
        <Route path="/edit/:slug" component={EditArticleContainer} />
        <Route path="/settings" component={SettingsFormContainer} />
        <Route path="/feed" component={HomePage} />
        <Route path="/tags/:tag" component={HomePage} />*/}
        <Route component={HomePage} />
      </Switch>
      <Footer />
    </div>
  )
}

export default App
