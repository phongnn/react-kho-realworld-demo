import React from "react"
import { Link } from "react-router-dom"

import { Comment } from "../../../../common/types"
import { formatDate } from "../../../../common/helpers"
import { useUser } from "../../../__shared__/UserProvider"

function CommentView(props: {
  comment: Partial<Comment>
  onDelete: (commentId: string) => void
  processing: boolean
}) {
  const loggedInUser = useUser()
  const { id, body, author, createdAt } = props.comment
  const { username, image } = author!
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{body}</p>
      </div>
      <div className="card-footer">
        <Link to={`/users/${username}`} className="comment-author">
          <img
            src={image}
            className="comment-author-img"
            alt={`Avatar of ${username}`}
          />
        </Link>
        &nbsp;
        <Link to={`/users/${username}`} className="comment-author">
          {username}
        </Link>
        <span className="date-posted">{formatDate(createdAt!)}</span>
        {loggedInUser && loggedInUser.username === username && (
          <span className="mod-options">
            <i
              className="ion-trash-a"
              data-testid={`btn-delete-${id}`}
              onClick={() => !props.processing && props.onDelete(id!)}
            ></i>
          </span>
        )}
      </div>
    </div>
  )
}

export default CommentView
