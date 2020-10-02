import config from "../common/config"
import {
  Article,
  ArticleListResult,
  Errors,
  LogInResult,
  User,
} from "../common/types"
import { getAccessToken } from "../accessToken"

export async function getUser(username: string) {
  const result = await request(`/profiles/${username}`)
  return setAvatarPlaceholder(result.profile)
}

export async function getArticle(slug: string) {
  const result = await request(`/articles/${slug}`)
  return result.article as Article
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

export async function followUser(username: string) {
  await request(`/profiles/${username}/follow`, { method: "post" })
  return { username, following: true } as Partial<User>
}

export async function unfollowUser(username: string) {
  await request(`/profiles/${username}/follow`, { method: "delete" })
  return { username, following: false } as Partial<User>
}

export async function createArticle(input: any) {
  const result = await request(`/articles`, {
    method: "post",
    body: { article: input },
  })
  return result.article as Article
}

export async function updateArticle(slug: string, input: any) {
  const result = await request(`/articles/${slug}`, {
    method: "put",
    body: { article: input },
  })
  return result.article as Article
}

export async function deleteArticle(slug: string) {
  await request(`/articles/${slug}`, { method: "delete" })
}

export async function favoriteArticle(slug: string) {
  const result = await request(`/articles/${slug}/favorite`, { method: "post" })
  return result.article as Article
}

export async function unfavoriteArticle(slug: string) {
  const result = await request(`/articles/${slug}/favorite`, {
    method: "delete",
  })
  return result.article as Article
}

export async function createComment(slug: string, input: any) {
  const result = await request(`/articles/${slug}/comments`, {
    method: "post",
    body: { comment: input },
  })
  return result.comment as Comment
}

export async function deleteComment(slug: string, commentId: string) {
  await request(`/articles/${slug}/comments/${commentId}`, { method: "delete" })
}

export async function signUp(input: any) {
  const result = await request(`/users`, {
    method: "post",
    body: { user: input },
  })
  return result.errors ? (result as Errors) : transformLogInResult(result)
}

export async function signIn(input: any) {
  const result = await request(`/users/login`, {
    method: "post",
    body: { user: input },
  })
  return result.errors ? (result as Errors) : transformLogInResult(result)
}

export async function signInWithToken(token: string) {
  const result = await request(`/user`, {
    headers: {
      authorization: `Token ${token}`,
    },
  })
  return transformLogInResult(result)
}

export async function updateSettings(input: any) {
  const result = await request(`/user`, {
    method: "put",
    body: { user: input },
  })
  return result.errors ? (result as Errors) : transformLogInResult(result)
}

// ======= private helper functions ========

async function request(
  url: string,
  options: {
    method?: "get" | "post" | "put" | "delete"
    headers?: Record<string, string>
    body?: any
  } = {}
) {
  const { method = "get", headers, body } = options
  const isJson = body && typeof body !== "string"
  const res = await fetch(`${config.api.baseUrl}${url}`, {
    method,
    headers: prepareHeaders(isJson, headers),
    body: isJson ? JSON.stringify(body) : body,
  })

  if (res.status >= 200 && res.status < 300) {
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await res.json()
    } else {
      return await res.text()
    }
  } else if (res.status === 422) {
    return (await res.json()) as Errors
  } else {
    throw new Error(`HTTP status ${res.status} (${res.statusText}).`)
  }
}

function prepareHeaders(isJson: boolean, headers?: Record<string, string>) {
  const result = new Headers()
  const token = getAccessToken()
  if (token) {
    result.set("authorization", `Token ${token}`)
  }
  if (isJson) {
    result.set("content-type", "application/json")
  }
  if (headers) {
    Object.entries(headers).forEach(([header, value]) =>
      result.set(header, value)
    )
  }
  return result
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
