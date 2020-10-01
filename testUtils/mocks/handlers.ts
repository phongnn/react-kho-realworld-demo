import { rest } from "msw"

import {
  allArticles,
  accessToken,
  // popularTags,
  // getArticlesByTag,
  alice,
  aliceArticles,
  getFavArticles,
  bob,
  bobArticles,
  // getFeedArticles,
} from "./data"
import config from "../../src/common/config"

const { baseUrl } = config.api
const authHeader = `Token ${accessToken}`

export const handlers = [
  rest.get(`${baseUrl}/articles`, ({ url }, res, ctx) => {
    const limit = parseInt(url.searchParams.get("limit")!)
    const offset = parseInt(url.searchParams.get("offset")!)
    const author = url.searchParams.get("author")
    const favorited = url.searchParams.get("favorited")
    const articles = favorited
      ? getFavArticles(favorited)
      : author === "alice"
      ? aliceArticles
      : author === "bob"
      ? bobArticles
      : allArticles
    return res(ctx.json(transformArticleList(articles, limit, offset)))
  }),
  // graphql.query<YourFeedQueryResult, YourFeedQueryVariables>(
  //   "GetYourFeed",
  //   ({ variables: { limit, offset } }, res, ctx) =>
  //     res(
  //       ctx.data({
  //         feed: transformArticleList(
  //           getFeedArticles(alice.username),
  //           limit,
  //           offset
  //         ),
  //       })
  //     )
  // ),
  // graphql.query<PopularTagsQueryResult>("GetPopularTags", (req, res, ctx) =>
  //   res(ctx.data({ tags: popularTags }))
  // ),
  // graphql.query<ArticlesByTagQueryResult, ArticlesByTagQueryVariables>(
  //   "GetArticlesByTag",
  //   ({ variables: { tag, limit, offset } }, res, ctx) =>
  //     res(
  //       ctx.data({
  //         tag: transformArticleList(getArticlesByTag(tag), limit, offset),
  //       })
  //     )
  // ),
  rest.get(`${baseUrl}/articles/:slug`, ({ params: { slug } }, res, ctx) =>
    res(
      ctx.json({
        article: transformArticle(allArticles.find((a) => a.slug === slug)!),
      })
    )
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
  // graphql.mutation<UpdateProfileMutationResult, UpdateProfileMutationVariables>(
  //   "UpdateProfile",
  //   ({ variables: { input } }, res, ctx) =>
  //     res(
  //       ctx.data({
  //         updateProfile: {
  //           username: alice.username,
  //           ...input,
  //         },
  //       })
  //     )
  // ),
  // graphql.mutation<LoginMutationResult, LoginMutationVariables>(
  //   "LogIn",
  //   ({ variables: { email, password } }, res, ctx) =>
  //     res(
  //       email === alice.email && password === alice.password
  //         ? ctx.data({
  //             login: {
  //               user: {
  //                 username: alice.username,
  //                 email: alice.email,
  //                 bio: alice.bio,
  //                 image: alice.image,
  //               },
  //               token: accessToken,
  //             },
  //           })
  //         : ctx.errors([{ message: "Invalid email or password." }])
  //     )
  // ),
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
      const { title, description, body, tags } = req.body.article
      const slug = `article-slug-${randomNumber()}`
      const now = new Date()
      const article = {
        slug, title, description, body, tags, favoriteCount: 0, comments: [], author: alice, createdAt: now, updatedAt: now
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
            tags,
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
      const { title, description, body, tags } = req.body.article
      const now = new Date()
      Object.assign(
        aliceArticles.find(a => a.slug === slug),
        { title, description, body, tags, updatedAt: now }
      )
      return res(
        ctx.json({
          article: {
            slug,
            title,
            description,
            body,
            tags,
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
  rest.delete(`${baseUrl}/articles/:slug/comments`, (req, res, ctx) => {
    return res(ctx.status(204))
  }),
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

function transformArticle(article: typeof allArticles[0]) {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    tags: article.tags,
    updatedAt: article.updatedAt,
    author: {
      username: article.author.username,
      image: article.author.image,
      following: false,
    },
    favorited: false,
    favoriteCount: article.favoriteCount,
    comments: article.comments.map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt,
      author: {
        username: c.author.username,
        image: c.author.image,
      },
    })),
  }
}

function randomNumber() {
  return Math.round(10000 + Math.random() * 10000)
}
