import React, { useState } from "react"

function NewTagButton(props: { onClick: () => void }) {
  return (
    <span className="tag-default tag-pill" onClick={props.onClick}>
      <i className="ion-plus"></i>
      New Tag
    </span>
  )
}

function NewTagForm(props: {
  onSubmit: (tag: string) => void
  onCancel: () => void
}) {
  const [tag, setTag] = useState("")
  return (
    <form
      className="form-inline"
      style={{ display: "inline-block" }}
      onSubmit={(evt) => {
        evt.preventDefault()
        if (!!tag.trim()) {
          props.onSubmit(tag.trim())
        }
      }}
    >
      <input
        className="form-control-sm"
        type="text"
        placeholder="Enter tag..."
        value={tag}
        onChange={(evt) => setTag(evt.target.value)}
      />{" "}
      &nbsp;
      <button type="submit" className="btn btn-sm btn-primary mb-2">
        Add
      </button>
      <button
        className="btn btn-sm btn-link"
        onClick={props.onCancel}
        type="button"
      >
        Cancel
      </button>
    </form>
  )
}

function NewTagFormWrapper(props: { onSubmit: (tag: string) => void }) {
  const [editing, setEditing] = useState(false)
  return (
    <>
      {!editing && <NewTagButton onClick={() => setEditing(true)} />}
      {editing && (
        <NewTagForm
          onCancel={() => setEditing(false)}
          onSubmit={(tag) => {
            props.onSubmit(tag)
            setEditing(false)
          }}
        />
      )}
    </>
  )
}

export default NewTagFormWrapper
