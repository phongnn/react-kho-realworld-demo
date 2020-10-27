import React, { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useMutation } from "react-kho"

import { useUser } from "../__shared__/UserProvider"
import { signOutMutation, updateSettingsMutation } from "../../store/mutations"
import SettingsForm from "./SettingsForm"
import { Errors } from "../../common/types"

function SettingsFormContainer() {
  const loggedInUser = useUser()
  const browserHistory = useHistory()
  const [
    submit,
    {
      loading: processing,
      data: mutationResult,
      error: updatingError,
      called: updated,
    },
  ] = useMutation(updateSettingsMutation)
  const [signOut, { called: signedOut }] = useMutation(signOutMutation)

  const serverErrors =
    mutationResult && (mutationResult as Errors).errors
      ? (mutationResult as Errors).errors
      : updatingError
      ? { "": "Unexpected error. Please try again later." }
      : undefined

  useEffect(() => {
    if (signedOut) {
      browserHistory.push("/")
    } else if (updated && !serverErrors) {
      browserHistory.push(`/users/${loggedInUser!.username}`)
    }
  }, [updated, serverErrors, signedOut, browserHistory, loggedInUser])

  if (!loggedInUser) {
    browserHistory.replace("/signup")
    return null
  }

  return (
    <SettingsForm
      current={loggedInUser}
      onSubmit={(input) => submit({ arguments: input })}
      processing={processing}
      serverErrors={serverErrors}
      onSignOut={signOut}
    />
  )
}

export default SettingsFormContainer
