import { rest } from "msw"

import {
  allArticles,
  accessToken,
  popularTags,
  getArticlesByTag,
  alice,
  aliceArticles,
  getFavArticles,
  bob,
  bobArticles,
  getFeedArticles,
} from "./data"
import config from "../../common/config"

const { baseUrl } = config.api
const authHeader = `Token ${accessToken}`

export const handlers = [
  rest.get(`${baseUrl}/articles`, ({ url }, res, ctx) => {
    const limit = parseInt(url.searchParams.get("limit")!)
    const offset = parseInt(url.searchParams.get("offset")!)
    const tag = url.searchParams.get("tag")
    const author = url.searchParams.get("author")
    const favorited = url.searchParams.get("favorited")
    const articles = tag
      ? getArticlesByTag(tag)
      : favorited
      ? getFavArticles(favorited)
      : author === "alice"
      ? aliceArticles
      : author === "bob"
      ? bobArticles
      : allArticles
    return res(ctx.json(transformArticleList(articles, limit, offset)))
  }),
  rest.get(`${baseUrl}/articles/feed`, ({ url }, res, ctx) => {
    const limit = parseInt(url.searchParams.get("limit")!)
    const offset = parseInt(url.searchParams.get("offset")!)
    return res(
      ctx.json(
        transformArticleList(getFeedArticles(alice.username), limit, offset)
      )
    )
  }),
  rest.get(`${baseUrl}/tags`, (req, res, ctx) =>
    res(ctx.json({ tags: popularTags }))
  ),
  rest.get(`${baseUrl}/articles/:slug`, ({ params: { slug } }, res, ctx) => {
    const article = allArticles.find((a) => a.slug === slug)!
    return res(
      ctx.json({
        article: {
          slug: article.slug,
          title: article.title,
          description: article.description,
          body: article.body,
          tagList: article.tagList,
          updatedAt: article.updatedAt,
          author: {
            username: article.author.username,
            image: article.author.image,
            following: false,
          },
          favorited: false,
          favoriteCount: article.favoriteCount,
        },
      })
    )
  }),
  rest.get(
    `${baseUrl}/articles/:slug/comments`,
    ({ params: { slug } }, res, ctx) => {
      const article = allArticles.find((a) => a.slug === slug)!
      return res(
        ctx.json({
          comments: article.comments.map((c) => ({
            id: c.id,
            body: c.body,
            createdAt: c.createdAt,
            author: {
              username: c.author.username,
              image: c.author.image,
            },
          })),
        })
      )
    }
  ),
  rest.get(
    `${baseUrl}/profiles/:username`,
    ({ params: { username } }, res, ctx) => {
      const user = username === "alice" ? alice : bob
      return res(
        ctx.json({
          profile: {
            username: user.username,
            image: user.image,
            bio: user.bio,
            following: false,
          },
        })
      )
    }
  ),
  rest.post(`${baseUrl}/users`, (req, res, ctx) => {
    // @ts-ignore
    const { username, email } = req.body.user
    return res(
      ctx.json({
        user: {
          username,
          email,
          token: accessToken,
        },
      })
    )
  }),
  rest.put(`${baseUrl}/user`, (req, res, ctx) => {
    // @ts-ignore
    const input = req.body.user
    return res(
      ctx.json({
        user: {
          username: alice.username,
          token: accessToken,
          ...input,
        },
      })
    )
  }),
  rest.post(`${baseUrl}/users/login`, (req, res, ctx) => {
    // @ts-ignore
    const { email, password } = req.body.user
    return email === alice.email && password === alice.password
      ? res(
          ctx.json({
            user: {
              username: alice.username,
              email: alice.email,
              bio: alice.bio,
              image: alice.image,
              token: accessToken,
            },
          })
        )
      : res(
          ctx.status(422),
          ctx.json({ errors: { server: "Invalid email or password." } })
        )
  }),
  rest.get(`${baseUrl}/user`, ({ headers }, res, ctx) =>
    headers.get("authorization") === authHeader
      ? res(
          ctx.json({
            user: {
              username: alice.username,
              email: alice.email,
              bio: alice.bio,
              image: alice.image,
              token: accessToken,
            },
          })
        )
      : res(ctx.status(401, "Invalid access token."))
  ),
  rest.post(
    `${baseUrl}/articles/:slug/favorite`,
    ({ params: { slug } }, res, ctx) => {
      const article = allArticles.find((a) => a.slug === slug)!
      return res(
        ctx.json({
          article: {
            slug,
            favoriteCount: ++article.favoriteCount,
            favorited: true,
          },
        })
      )
    }
  ),
  rest.delete(
    `${baseUrl}/articles/:slug/favorite`,
    ({ params: { slug } }, res, ctx) => {
      const article = allArticles.find((a) => a.slug === slug)!
      return res(
        ctx.json({
          article: {
            slug,
            favoriteCount: --article.favoriteCount,
            favorited: false,
          },
        })
      )
    }
  ),
  rest.post(
    `${baseUrl}/profiles/:username/follow`,
    ({ params: { username } }, res, ctx) => {
      return res(
        ctx.json({
          username,
          following: true,
        })
      )
    }
  ),
  rest.delete(
    `${baseUrl}/profiles/:username/follow`,
    ({ params: { username } }, res, ctx) => {
      return res(
        ctx.json({
          username,
          following: false,
        })
      )
    }
  ),
  rest.post(
    `${baseUrl}/articles`,
    // prettier-ignore
    (req, res, ctx) => {
      // @ts-ignore
      const { title, description, body, tagList } = req.body.article
      const slug = `article-slug-${randomNumber()}`
      const now = new Date()
      const article = {
        slug, title, description, body, tagList, favoriteCount: 0, comments: [], author: alice, createdAt: now, updatedAt: now
      }
      aliceArticles.unshift(article)
      allArticles.unshift(article)
      return res(
        ctx.json({
          article: {
            slug,
            title,
            description,
            body,
            tagList,
            author: alice,
            createdAt: now,
            updatedAt: now
          },
        })
      )
    }
  ),
  rest.put(
    `${baseUrl}/articles/:slug`,
    // prettier-ignore
    (req, res, ctx) => {
      const { slug } = req.params
      // @ts-ignore
      const { title, description, body, tagList } = req.body.article
      const now = new Date()
      Object.assign(
        aliceArticles.find(a => a.slug === slug),
        { title, description, body, tagList, updatedAt: now }
      )
      return res(
        ctx.json({
          article: {
            slug,
            title,
            description,
            body,
            tagList,
            updatedAt: now
          },
        })
      )
    }
  ),
  rest.delete(
    `${baseUrl}/articles/:slug`,
    // prettier-ignore
    ({ params: { slug } }, res, ctx) => {
      aliceArticles.splice(aliceArticles.findIndex(a => a.slug === slug), 1)
      allArticles.splice(allArticles.findIndex(a => a.slug === slug), 1)
      return res(ctx.status(204))
    }
  ),
  rest.post(`${baseUrl}/articles/:slug/comments`, (req, res, ctx) => {
    // @ts-ignore
    const { body } = req.body.comment
    const id = `comment-${randomNumber()}`
    return res(
      ctx.json({
        comment: {
          id,
          body,
          createdAt: new Date(),
          author: {
            username: alice.username,
          },
        },
      })
    )
  }),
  rest.delete(
    `${baseUrl}/articles/:slug/comments/:commentId`,
    (req, res, ctx) => {
      return res(ctx.status(204))
    }
  ),
]

function transformArticleList(
  articles: typeof allArticles,
  limit: number,
  offset: number
) {
  return {
    articlesCount: articles.length,
    articles: allArticles
      .slice(offset, offset + limit)
      .map(
        ({ slug, title, description, updatedAt, favoriteCount, author }) => ({
          slug,
          title,
          description,
          updatedAt, // updatedAt.getTime(),
          favorited: false,
          favoriteCount,
          author: {
            username: author.username,
            image: author.image,
          },
        })
      ),
  }
}

function randomNumber() {
  return Math.round(10000 + Math.random() * 10000)
}
