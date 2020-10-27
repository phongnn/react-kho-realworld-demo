import React from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"

import { EMAIL_PATTERN } from "../../common/constants"

interface SignUpHandler {
  (input: { username: string; email: string; password: string }): void
}

function SignUpForm(props: {
  onSubmit: SignUpHandler
  processing?: boolean
  serverErrors?: Record<string, string | string[]>
}) {
  const { register, errors, handleSubmit: validateAndSubmit } = useForm()
  const handleSubmit = (data: Record<string, any>) => {
    props.onSubmit({
      username: data.username.trim().toLocaleLowerCase(),
      email: data.email.toLocaleLowerCase(),
      password: data.password.trim(),
    })
  }
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to="/signin">Have an account?</Link>
            </p>

            <ul className="error-messages">
              {props.serverErrors &&
                Object.entries(props.serverErrors).map(
                  ([fieldName, err], index) => (
                    <li key={index}>
                      {fieldName} {Array.isArray(err) ? err[0] : err}
                    </li>
                  )
                )}
              {Object.values(errors).map((err, index) => (
                <li key={index}>{err.message}</li>
              ))}
            </ul>

            <form onSubmit={validateAndSubmit(handleSubmit)}>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Username"
                  name="username"
                  ref={register({
                    required: "Username is required",
                    pattern: {
                      // eslint-disable-next-line
                      value: /^[a-zA-Z][\w\.]{1,28}[a-zA-Z0-9]$/,
                      message:
                        "Username must be from 3 to 30 alphanumeric characters",
                    },
                  })}
                  disabled={!!props.processing}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  name="email"
                  ref={register({
                    required: "Email is required",
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: "Invalid email",
                    },
                  })}
                  disabled={!!props.processing}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  name="password"
                  ref={register({
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters",
                    },
                  })}
                  disabled={!!props.processing}
                />
              </fieldset>
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                type="submit"
                disabled={!!props.processing}
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
