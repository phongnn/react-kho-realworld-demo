import { Mutation } from "react-kho"

import { UserType } from "../normalizedTypes"
import { signedInUserQuery } from "../queries"
import { signInWithToken, signUp, updateSettings } from "../../api"
import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from "../../accessToken"
import { LogInResult } from "../../common/types"

export const signInWithTokenMutation = new Mutation(
  "LoginWithToken",
  async () => {
    const token = getAccessToken()
    if (token) {
      return await signInWithToken(token)
    }
  },
  {
    shape: {
      user: UserType,
    },
    afterQueryUpdates(store, { mutationResult }) {
      if (mutationResult) {
        const { user, token } = mutationResult
        store.setQueryData(signedInUserQuery, user)
        saveAccessToken(token)
      } else {
        removeAccessToken()
      }
    },
  }
)

export const signUpMutation = new Mutation(
  "SignUp",
  (args: { username: string; email: string; password: string }) => signUp(args),
  {
    shape: { user: UserType },
    afterQueryUpdates(store, { mutationResult }) {
      if ((mutationResult as LogInResult).token) {
        const { user, token } = mutationResult as LogInResult
        store.setQueryData(signedInUserQuery, user)
        saveAccessToken(token)
      }
    },
  }
)

export const signOutMutation = new Mutation(
  "SignOut",
  () => Promise.resolve(),
  {
    afterQueryUpdates: (store) => store.resetStore(),
    // syncMode: true,
  }
)

export const updateSettingsMutation = new Mutation(
  "UpdateSettings",
  (args: { email: string; image?: string | null; bio?: string | null }) =>
    updateSettings(args),
  {
    shape: { user: UserType },
    afterQueryUpdates(store, { mutationResult }) {
      if ((mutationResult as LogInResult).token) {
        const { token } = mutationResult as LogInResult
        saveAccessToken(token)
      }
    },
  }
)
