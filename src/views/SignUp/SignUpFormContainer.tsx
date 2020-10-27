import React from "react"
import { Redirect } from "react-router-dom"
import { useMutation } from "react-kho"

import { useUser } from "../__shared__/UserProvider"
import SignUpForm from "./SignUpForm"
import { signUpMutation } from "../../store/mutations"
import { Errors } from "../../common/types"

function SignUpFormContainer() {
  const user = useUser()
  const [submit, { loading, error, data }] = useMutation(signUpMutation)

  const serverErrors =
    data && (data as Errors).errors
      ? (data as Errors).errors
      : error
      ? { "": "Unexpected error. Please try again later." }
      : undefined

  if (user) {
    return <Redirect to="/" />
  }

  return (
    <SignUpForm
      onSubmit={(input) => submit({ arguments: input })}
      processing={loading}
      serverErrors={serverErrors}
    />
  )
}

export default SignUpFormContainer
