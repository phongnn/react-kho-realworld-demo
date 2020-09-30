import React from "react"
import { useMutation } from "react-kho"

import CommentForm from "./CommentForm"
import { createCommentMutation } from "../../../../store/mutations"

function CommentFormContainer(props: { slug: string }) {
  const [postComment, { loading: processing, error }] = useMutation(
    createCommentMutation
  )

  const serverErrMsg = error
    ? "Unexpected error. Please try again later."
    : undefined

  return (
    <CommentForm
      onSubmit={(comment) =>
        postComment({ arguments: { slug: props.slug, comment } })
      }
      processing={processing}
      serverErrorMessage={serverErrMsg}
    />
  )
}

export default CommentFormContainer
