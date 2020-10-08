import React, { useState } from "react"
import { useForm } from "react-hook-form"

import NewTagFormWrapper from "./NewTagFormWrapper"

interface ArticleInput {
  title: string
  description: string
  body: string
  tagList: string[]
}

export interface ArticleFormHandler {
  (input: ArticleInput): void
}

function ArticleForm(props: {
  onSubmit: ArticleFormHandler
  processing?: boolean
  serverErrorMessage?: string
  existingArticle?: ArticleInput
}) {
  const { register, handleSubmit: validateAndSubmit, errors } = useForm()
  const [tagList, setTagList] = useState(props.existingArticle?.tagList || [])
  const handleSubmit = (data: Record<string, any>) => {
    props.onSubmit({
      title: data.title.trim(),
      description: data.description.trim(),
      body: data.body,
      tagList,
    })
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ul className="error-messages">
              {props.serverErrorMessage && <li>{props.serverErrorMessage}</li>}
              {Object.values(errors).map((err, index) => (
                <li key={index}>{err.message}</li>
              ))}
            </ul>
            <form>
              <fieldset className="form-group">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Article Title"
                  name="title"
                  defaultValue={props.existingArticle?.title}
                  ref={register({
                    required: "Title is required",
                    minLength: {
                      value: 3,
                      message: "Title must have at least 3 characters",
                    },
                    maxLength: {
                      value: 255,
                      message: "Title must not exceed 255 characters",
                    },
                  })}
                  disabled={!!props.processing}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="What's this article about?"
                  name="description"
                  defaultValue={props.existingArticle?.description}
                  ref={register({
                    required: "Description is required",
                    minLength: {
                      value: 3,
                      message: "Description must have at least 3 characters",
                    },
                    maxLength: {
                      value: 1024,
                      message: "Description must not exceed 1024 characters",
                    },
                  })}
                  disabled={!!props.processing}
                />
              </fieldset>
              <fieldset className="form-group">
                <textarea
                  className="form-control"
                  rows={8}
                  placeholder="Write your article (in markdown)"
                  name="body"
                  defaultValue={props.existingArticle?.body}
                  ref={register({
                    required: "Body is required",
                    minLength: {
                      value: 3,
                      message: "Body must have at least 3 characters",
                    },
                    maxLength: {
                      value: 10000,
                      message: "Body must not exceed 10000 characters",
                    },
                  })}
                  disabled={!!props.processing}
                ></textarea>
              </fieldset>
            </form>
            <div className="tag-list">
              {tagList.map((tag) => (
                <span className="tag-default tag-pill" key={tag}>
                  <i
                    className="ion-close-round"
                    data-testid={`btn-delete-${tag}`}
                    onClick={() => setTagList(tagList.filter((t) => t !== tag))}
                  ></i>
                  {tag}
                </span>
              ))}
              <NewTagFormWrapper
                onSubmit={(tag) =>
                  !tagList.includes(tag) && setTagList([...tagList, tag])
                }
              />
            </div>
            <button
              className="btn btn-lg pull-xs-right btn-primary"
              disabled={!!props.processing}
              onClick={validateAndSubmit(handleSubmit)}
            >
              Publish Article
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleForm
