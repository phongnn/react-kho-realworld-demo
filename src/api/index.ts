import config from "../common/config"
import { ArticleListResult, Errors, LogInResult, User } from "../common/types"
import { getAccessToken } from "../accessToken"

export async function getUser(username: string) {
  const result = await request(`/profiles/${username}`)
  return setAvatarPlaceholder(result.profile)
}

export async function getGlobalFeed(limit: number, offset: number) {
  const result = await request(`/articles?limit=${limit}&offset=${offset}`)
  return result as ArticleListResult
}

export async function getUserArticles(
  username: string,
  limit: number,
  offset: number
) {
  const result = await request(
    `/articles?author=${username}&limit=${limit}&offset=${offset}`
  )
  return result as ArticleListResult
}

export async function getFavArticles(
  username: string,
  limit: number,
  offset: number
) {
  const result = await request(
    `/articles?favorited=${username}&limit=${limit}&offset=${offset}`
  )
  return result as ArticleListResult
}

export async function signInWithToken(token: string) {
  const result = await request(`/user`, {
    headers: {
      authorization: `Token ${token}`,
    },
  })
  return transformLogInResult(result)
}

export async function signUp(input: any) {
  const result = await request(`/users`, {
    method: "post",
    body: { user: input },
  })
  return result.errors ? (result as Errors) : transformLogInResult(result)
}

export async function followUser(username: string) {
  await request(`/profiles/${username}/follow`, { method: "post" })
  return { username, following: true } as Partial<User>
}

export async function unfollowUser(username: string) {
  await request(`/profiles/${username}/follow`, { method: "delete" })
  return { username, following: false } as Partial<User>
}

// ======= private helper functions ========

async function request(
  url: string,
  options: {
    method?: "get" | "post" | "delete"
    headers?: Record<string, string>
    body?: any
  } = {}
) {
  const { method = "get", headers, body } = options
  const res = await fetch(`${config.api.baseUrl}${url}`, {
    method,
    headers: prepareHeaders(method, headers),
    body: body && typeof body !== "string" ? JSON.stringify(body) : body,
  })

  if (res.status >= 200 && res.status < 300) {
    return await res.json()
  } else if (res.status === 422) {
    return (await res.json()) as Errors
  } else {
    throw new Error(`HTTP status ${res.status} (${res.statusText}).`)
  }
}

function prepareHeaders(method: string, headers?: Record<string, string>) {
  const result: Record<string, string> = {}
  const token = getAccessToken()
  if (token) {
    result["Authorization"] = `Token ${token}`
  }

  if (method === "post") {
    result["Content-Type"] = "application/json"
  }

  return headers ? { ...result, ...headers } : result
}

function transformLogInResult(data: { user: any }) {
  const {
    user: { token, ...rest },
  } = data
  return { token, user: setAvatarPlaceholder(rest) } as LogInResult
}

function setAvatarPlaceholder(user: User) {
  const { image, ...rest } = user
  return image
    ? user
    : {
        image: "https://static.productionready.io/images/smiley-cyrus.jpg",
        ...rest,
      }
}
