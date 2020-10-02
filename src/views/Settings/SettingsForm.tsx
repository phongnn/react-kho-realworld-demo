import React from "react"
import { useForm } from "react-hook-form"

import { EMAIL_PATTERN, URL_PATTERN } from "../../common/constants"

interface SettingsInput {
  email: string
  image?: string | null
  bio?: string | null
}

export interface SettingsFormHandler {
  (input: SettingsInput): void
}

function SettingsForm(props: {
  current: SettingsInput
  onSubmit: SettingsFormHandler
  onSignOut?: () => void
  processing?: boolean
  serverErrors?: Record<string, string | string[]>
}) {
  const { email, image, bio } = props.current
  const { register, handleSubmit: validateAndSubmit, errors } = useForm()
  const handleSubmit = (data: Record<string, any>) => {
    props.onSubmit({
      email: data.email.trim().toLowerCase(),
      bio: data.bio.trim(),
      image: data.image.trim(),
    })
  }
  const { processing } = props

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            <ul className="error-messages">
              {props.serverErrors &&
                Object.values(props.serverErrors).map((err, index) => (
                  <li key={index}>{Array.isArray(err) ? err[0] : err}</li>
                ))}
              {Object.values(errors).map((err, index) => (
                <li key={index}>{err.message}</li>
              ))}
            </ul>
            <form onSubmit={validateAndSubmit(handleSubmit)}>
              <fieldset className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  defaultValue={image || ""}
                  name="image"
                  ref={register({
                    pattern: {
                      value: URL_PATTERN,
                      message: "Invalid image URL",
                    },
                  })}
                  disabled={processing}
                />
              </fieldset>
              <fieldset className="form-group">
                <textarea
                  className="form-control form-control-lg"
                  rows={8}
                  placeholder="Short bio about you"
                  defaultValue={bio || ""}
                  name="bio"
                  ref={register}
                  disabled={processing}
                ></textarea>
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  defaultValue={email}
                  name="email"
                  ref={register({
                    required: "Email is required",
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: "Invalid email",
                    },
                  })}
                  disabled={processing}
                />
              </fieldset>
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                type="submit"
                disabled={processing}
              >
                Update Settings
              </button>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <hr />
            <button
              className="btn btn-outline-danger"
              disabled={processing}
              onClick={props.onSignOut}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsForm
