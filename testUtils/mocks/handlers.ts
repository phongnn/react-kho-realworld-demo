import { rest } from "msw"

import {
  allArticles,
  accessToken,
  // popularTags,
  // getArticlesByTag,
  // alice,
  // aliceArticles,
  // getFavArticles,
  // bob,
  // bobArticles,
  // getFeedArticles,
} from "./data"
import config from "../../src/common/config"

const { baseUrl } = config.api

export const handlers = [
  rest.get(`${baseUrl}/articles`, ({ url }, res, ctx) => {
    const limit = parseInt(url.searchParams.get("limit")!)
    const offset = parseInt(url.searchParams.get("offset")!)
    return res(ctx.json(transformArticleList(allArticles, limit, offset)))
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
  // graphql.query<UserArticlesQueryResult, UserArticlesQueryVariables>(
  //   "GetUserArticles",
  //   ({ variables: { username, limit, offset } }, res, ctx) => {
  //     const articles = username === "alice" ? aliceArticles : bobArticles
  //     return res(
  //       ctx.data({
  //         user: {
  //           username,
  //           articles: transformArticleList(articles, limit, offset),
  //         },
  //       })
  //     )
  //   }
  // ),
  // graphql.query<FavoriteArticlesQueryResult, FavoriteArticlesQueryVariables>(
  //   "GetFavoriteArticles",
  //   ({ variables: { username, limit, offset } }, res, ctx) =>
  //     res(
  //       ctx.data({
  //         user: {
  //           username,
  //           favoriteArticles: transformArticleList(
  //             getFavArticles(username),
  //             limit,
  //             offset
  //           ),
  //         },
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
  // graphql.query<ArticleQueryResult, ArticleQueryVariables>(
  //   "GetArticle",
  //   ({ variables: { slug } }, res, ctx) =>
  //     res(
  //       ctx.data({
  //         article: transformArticle(allArticles.find((a) => a.slug === slug)!),
  //       })
  //     )
  // ),
  // graphql.query<UserInfoQueryResult, UserInfoQueryVariables>(
  //   "GetUserInfo",
  //   ({ variables: { username } }, res, ctx) => {
  //     const user = username === "alice" ? alice : bob
  //     return res(
  //       ctx.data({
  //         user: {
  //           username: user.username,
  //           image: user.image,
  //           bio: user.bio,
  //           following: false,
  //         },
  //       })
  //     )
  //   }
  // ),
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
  // graphql.mutation<
  //   LogInWithTokenMutationResult,
  //   LogInWithTokenMutationVariables
  // >("LoginWithToken", ({ variables: { token } }, res, ctx) =>
  //   res(
  //     token === accessToken
  //       ? ctx.data({
  //           loginWithToken: {
  //             user: {
  //               username: alice.username,
  //               email: alice.email,
  //               bio: alice.bio,
  //               image: alice.image,
  //             },
  //             token: accessToken,
  //           },
  //         })
  //       : ctx.errors([{ message: "Invalid access token." }])
  //   )
  // ),
  // graphql.mutation<
  //   FavoriteArticleMutationResult,
  //   FavoriteArticleMutationVariables
  // >("FavoriteArticle", ({ variables: { slug, favorited } }, res, ctx) => {
  //   const article = allArticles.find((a) => a.slug === slug)!
  //   if (favorited) {
  //     article.favoriteCount++
  //   } else {
  //     article.favoriteCount--
  //   }
  //   return res(
  //     ctx.data({
  //       favoriteArticle: {
  //         slug,
  //         favoriteCount: article.favoriteCount,
  //         favorited,
  //       },
  //     })
  //   )
  // }),
  // graphql.mutation<FollowUserMutationResult, FollowUserMutationVariables>(
  //   "FollowUser",
  //   ({ variables: { username, following } }, res, ctx) => {
  //     return res(
  //       ctx.data({
  //         followUser: {
  //           username,
  //           following,
  //         },
  //       })
  //     )
  //   }
  // ),
  // graphql.mutation<CreateArticleMutationResult, CreateArticleMutationVariables>(
  //   "CreateArticle",
  //   // prettier-ignore
  //   ({ variables: { input: { title, description, body, tags } } }, res, ctx) => {
  //     const slug = `article-slug-${randomNumber()}`
  //     const now = new Date()
  //     const article = {
  //       slug, title, description, body, tags, favoriteCount: 0, comments: [], author: alice, createdAt: now, updatedAt: now
  //     }
  //     aliceArticles.unshift(article)
  //     allArticles.unshift(article)
  //     return res(
  //       ctx.data({
  //         createArticle: {
  //           slug,
  //           title,
  //           description,
  //           body,
  //           tags,
  //           updatedAt: now
  //         },
  //       })
  //     )
  //   }
  // ),
  // graphql.mutation<UpdateArticleMutationResult, UpdateArticleMutationVariables>(
  //   "UpdateArticle",
  //   // prettier-ignore
  //   ({ variables: { slug, input: { title, description, body, tags } } }, res, ctx) => {
  //     const now = new Date()
  //     Object.assign(
  //       aliceArticles.find(a => a.slug === slug),
  //       { title, description, body, tags, updatedAt: now }
  //     )
  //     return res(
  //       ctx.data({
  //         updateArticle: {
  //           slug,
  //           title,
  //           description,
  //           body,
  //           tags,
  //           updatedAt: now
  //         },
  //       })
  //     )
  //   }
  // ),
  // graphql.mutation<DeleteArticleMutationResult, DeleteArticleMutationVariables>(
  //   "DeleteArticle",
  //   // prettier-ignore
  //   ({ variables: { slug } }, res, ctx) => {
  //     aliceArticles.splice(aliceArticles.findIndex(a => a.slug === slug), 1)
  //     allArticles.splice(allArticles.findIndex(a => a.slug === slug), 1)
  //     return res(
  //       ctx.data({
  //         deleteArticle: true,
  //       })
  //     )
  //   }
  // ),
  // graphql.mutation<CreateCommentMutationResult, CreateCommentMutationVariables>(
  //   "CreateComment",
  //   ({ variables: { comment } }, res, ctx) => {
  //     const id = `comment-${randomNumber()}`
  //     return res(
  //       ctx.data({
  //         createComment: {
  //           id,
  //           body: comment,
  //           updatedAt: new Date(),
  //           user: {
  //             username: alice.username,
  //           },
  //         },
  //       })
  //     )
  //   }
  // ),
  // graphql.mutation<DeleteCommentMutationResult, DeleteArticleMutationVariables>(
  //   "DeleteComment",
  //   (req, res, ctx) => {
  //     return res(
  //       ctx.data({
  //         deleteComment: true,
  //       })
  //     )
  //   }
  // ),
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

// function transformArticle(article: typeof allArticles[0]) {
//   return {
//     slug: article.slug,
//     title: article.title,
//     description: article.description,
//     body: article.body,
//     tags: article.tags,
//     updatedAt: article.updatedAt,
//     author: {
//       username: article.author.username,
//       image: article.author.image,
//       following: false,
//     },
//     favorited: false,
//     favoriteCount: article.favoriteCount,
//     comments: article.comments.map((c) => ({
//       id: c.id,
//       body: c.body,
//       updatedAt: c.updatedAt,
//       user: {
//         username: c.user.username,
//         image: c.user.image,
//       },
//     })),
//   }
// }

// function randomNumber() {
//   return Math.round(10000 + Math.random() * 10000)
// }
