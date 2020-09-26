const STORAGE_KEY = "access_token"

let token: string | null | undefined = undefined

export function getAccessToken() {
  if (token === undefined) {
    token = window.sessionStorage.getItem(STORAGE_KEY)
  }

  return token
}

export function saveAccessToken(accessToken: string) {
  if (!accessToken) {
    throw new Error("Access token is empty.")
  }

  token = accessToken
  window.sessionStorage.setItem(STORAGE_KEY, accessToken)
}

export function removeAccessToken() {
  token = null
  window.sessionStorage.removeItem(STORAGE_KEY)
}
