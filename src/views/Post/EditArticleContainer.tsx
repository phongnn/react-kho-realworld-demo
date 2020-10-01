import React, { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useQuery, useMutation } from "react-kho"

import { useUser } from "../__shared__/UserProvider"
import ArticleForm from "./ArticleForm"
import { articleQuery } from "../../store/queries"
import { updateArticleMutation } from "../../store/mutations"

function EditArticleContainer() {
  const { slug } = useParams()
  const browserHistory = useHistory()
  const user = useUser()
  const { data: article, loading, error: loadingError } = useQuery(
    articleQuery,
    { arguments: { slug } }
  )
  const [updateArticle, { loading: processing, error, data }] = useMutation(
    updateArticleMutation
  )
  const serverErrMsg = error
    ? "Unexpected error. Please try again later."
    : undefined

  useEffect(() => {
    if (data) {
      browserHistory.push(`/articles/${slug}`)
    }
  }, [data])

  if (!user) {
    browserHistory.replace("/signup")
    return null
  } else if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>
  } else if (loadingError) {
    return <p style={{ textAlign: "center" }}>Error: {loadingError.message}</p>
  } else if (!article) {
    return null
  }

  return (
    <ArticleForm
      onSubmit={({ title, description, body, tags }) => {
        updateArticle({
          arguments: {
            slug,
            input: { title, description, body, tags },
          },
        })
      }}
      processing={processing}
      serverErrorMessage={serverErrMsg}
      existingArticle={article}
    />
  )
}

export default EditArticleContainer
