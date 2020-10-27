import React from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"

import { EMAIL_PATTERN } from "../../common/constants"

function SignInForm(props: {
  onSubmit: (input: { email: string; password: string }) => void
  processing?: boolean
  serverErrors?: Record<string, string | string[]>
}) {
  const { register, errors, handleSubmit: validateAndSubmit } = useForm()
  const handleSubmit = (data: Record<string, any>) => {
    props.onSubmit({
      email: data.email.trim().toLocaleLowerCase(),
      password: data.password.trim(),
    })
  }
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link to="/signup">Need an account?</Link>
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
                    required: "Password is required",
                  })}
                  disabled={!!props.processing}
                />
              </fieldset>
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                type="submit"
                disabled={!!props.processing}
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInForm
