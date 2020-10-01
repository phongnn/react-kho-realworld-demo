import React, { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useMutation } from "react-kho"

import { useUser } from "../__shared__/UserProvider"
import ArticleForm from "./ArticleForm"
import { createArticleMutation } from "../../store/mutations"

function NewArticleContainer() {
  const user = useUser()
  const browserHistory = useHistory()
  const [createArticle, { loading: processing, error, data }] = useMutation(
    createArticleMutation
  )
  const serverErrMsg = error
    ? "Unexpected error. Please try again later."
    : undefined

  useEffect(() => {
    if (data) {
      browserHistory.push(`/articles/${data.slug}`)
    }
  }, [data])

  if (!user) {
    browserHistory.replace("/signup")
    return null
  }

  return (
    <ArticleForm
      onSubmit={({ title, description, body, tags }) => {
        createArticle({
          arguments: { title, description, body, tags },
        })
      }}
      processing={processing}
      serverErrorMessage={serverErrMsg}
    />
  )
}

export default NewArticleContainer
