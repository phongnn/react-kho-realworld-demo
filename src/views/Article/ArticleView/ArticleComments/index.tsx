import React from "react"
import { Link } from "react-router-dom"

import { Article } from "../../../../common/types"
import { useUser } from "../../../__shared__/UserProvider"
import CommentViewContainer from "./CommentViewContainer"
import CommentFormContainer from "./CommentFormContainer"

function ArticleComments(props: { article: Partial<Article> }) {
  const user = useUser()

  return (
    <div className="row">
      <div className="col-xs-12 col-md-8 offset-md-2">
        {!user && (
          <p>
            <Link to="/login">Sign in</Link> or{" "}
            <Link to="/signup">sign up</Link> to add comments on this article.
          </p>
        )}
        {user && <CommentFormContainer slug={props.article.slug!} />}
        {props.article.comments?.map((c) => (
          <CommentViewContainer
            key={c.id}
            slug={props.article.slug!}
            comment={c}
          />
        ))}
      </div>
    </div>
  )
}

export default ArticleComments
