import React from "react"
import { useForm } from "react-hook-form"

import config from "../../../../common/config"
import { useUser } from "../../../__shared__/UserProvider"

function CommentForm(props: {
  onSubmit: (comment: string) => void
  serverErrorMessage?: string
  processing?: boolean
}) {
  const { onSubmit, serverErrorMessage, processing } = props
  const user = useUser()!
  const { register, handleSubmit: validateAndSubmit, errors, reset } = useForm()
  const handleSubmit = (data: any) => {
    onSubmit(data.comment)
    reset()
  }

  return (
    <div>
      <ul className="error-messages">
        {serverErrorMessage && <li>{serverErrorMessage}</li>}
        {Object.values(errors).map((err, index) => (
          <li key={index}>{err.message}</li>
        ))}
      </ul>
      <form
        className="card comment-form"
        onSubmit={validateAndSubmit(handleSubmit)}
      >
        <div className="card-block">
          <textarea
            className="form-control"
            placeholder="Write a comment..."
            rows={3}
            name="comment"
            ref={register({
              required: "Please enter your comment",
            })}
            disabled={processing}
          ></textarea>
        </div>
        <div className="card-footer">
          <img
            src={user.image || config.placeholders.avatar}
            className="comment-author-img"
            alt={`Avatar of ${user.username}`}
          />
          <button
            className="btn btn-sm btn-primary"
            type="submit"
            disabled={processing}
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  )
}

export default CommentForm
