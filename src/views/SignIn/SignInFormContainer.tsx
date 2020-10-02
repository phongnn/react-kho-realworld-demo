import React from "react"
import { Redirect } from "react-router-dom"
import { useMutation } from "react-kho"

import { useUser } from "../__shared__/UserProvider"
import SignInForm from "./SignInForm"
import { signInMutation } from "../../store/mutations"
import { Errors } from "../../common/types"

function SignInFormContainer() {
  const user = useUser()
  const [signIn, { loading: formProcessing, error, data }] = useMutation(
    signInMutation
  )

  const serverErrors =
    data && (data as Errors).errors
      ? (data as Errors).errors
      : error
      ? { server: "Unexpected error. Please try again later." }
      : undefined

  if (user) {
    return <Redirect to="/" />
  }

  return (
    <SignInForm
      onSubmit={(credential) => signIn({ arguments: credential })}
      processing={formProcessing}
      serverErrors={serverErrors}
    />
  )
}

export default SignInFormContainer
