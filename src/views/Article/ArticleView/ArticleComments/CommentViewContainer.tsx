import React from "react"
import { useMutation } from "react-kho"

import { Comment } from "../../../../common/types"
import CommentView from "./CommentView"
import { deleteCommentMutation } from "../../../../store/mutations"

function CommentViewContainer(props: {
  slug: string
  comment: Partial<Comment>
}) {
  const { slug, comment } = props
  const [deleteComment, { loading: processing }] = useMutation(
    deleteCommentMutation
  )

  return (
    <CommentView
      comment={comment}
      onDelete={(commentId) =>
        deleteComment({
          arguments: { slug, commentId: comment.id! },
        })
      }
      processing={processing}
    />
  )
}

export default CommentViewContainer
