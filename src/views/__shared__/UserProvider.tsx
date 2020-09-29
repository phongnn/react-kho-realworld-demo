import React, { createContext, useContext, useEffect } from "react"
import { useLocalQuery, useMutation } from "react-kho"

import { User } from "../../common/types"
import { signedInUserQuery } from "../../store/queries"
import { signInWithTokenMutation } from "../../store/mutations"

export const UserContext = createContext<User | null | undefined>(null)
export const useUser = () => useContext(UserContext)

function UserProvider(props: { children: any }) {
  const { data: user } = useLocalQuery(signedInUserQuery)
  const [signIn] = useMutation(signInWithTokenMutation)

  useEffect(() => {
    signIn()
  }, [signIn])

  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  )
}

export default UserProvider
