import { Mutation } from "react-kho"

import {
  createArticle,
  createComment,
  deleteArticle,
  deleteComment,
  favoriteArticle,
  unfavoriteArticle,
  updateArticle,
} from "../../api"
import { ArticleType, CommentType } from "../normalizedTypes"
import {
  favArticlesQuery,
  globalFeedQuery,
  signedInUserQuery,
  userArticlesQuery,
} from "../queries"

export const createArticleMutation = new Mutation(
  "CreateArticle",
  (args: {
    title: string
    description: string
    body: string
    tagList: string[]
  }) => createArticle(args),
  {
    resultShape: ArticleType,
    afterQueryUpdates(store, { mutationResult: article }) {
      store.refetchQueries([
        userArticlesQuery.withOptions({
          // @ts-ignore
          arguments: { username: article.author.username },
        }),
        globalFeedQuery,
      ])
    },
  }
)

export const updateArticleMutation = new Mutation(
  "UpdateArticle",
  (args: {
    slug: string
    input: {
      title: string
      description: string
      body: string
      tagList: string[]
    }
  }) => updateArticle(args.slug, args.input),
  {
    resultShape: ArticleType,
  }
)

export const deleteArticleMutation = new Mutation(
  "DeleteArticle",
  (args: { slug: string }) => deleteArticle(args.slug),
  {
    beforeQueryUpdates(cache, { mutationArgs: { slug } }) {
      cache.deleteObject(cache.findObjectRef(ArticleType, { slug })!)
    },
  }
)

export const favoriteArticleMutation = new Mutation(
  "FavoriteArticle",
  (args: { slug: string; favorited: boolean }) => {
    const { slug, favorited } = args
    return favorited ? favoriteArticle(slug) : unfavoriteArticle(slug)
  },
  {
    resultShape: ArticleType,
    afterQueryUpdates(store) {
      const user = store.getQueryData(signedInUserQuery)!
      store.refetchQueries([
        favArticlesQuery.withOptions({
          // @ts-ignore
          arguments: { username: user.username },
        }),
      ])
    },
  }
)

export const createCommentMutation = new Mutation(
  "CreateComment",
  (args: { slug: string; comment: string }) =>
    createComment(args.slug, { body: args.comment }),
  {
    resultShape: CommentType,
    beforeQueryUpdates(
      cache,
      { mutationArgs: { slug }, mutationResult: commentRef }
    ) {
      const articleRef = cache.findObjectRef(ArticleType, { slug })!
      const article = cache.readObject(articleRef)
      cache.updateObject(articleRef, {
        ...article,
        comments: [...(article.comments || []), commentRef],
      })
    },
  }
)

export const deleteCommentMutation = new Mutation(
  "DeleteComment",
  (args: { slug: string; commentId: string }) =>
    deleteComment(args.slug, args.commentId),
  {
    resultShape: CommentType,
    beforeQueryUpdates(cache, { mutationArgs: { commentId } }) {
      cache.deleteObject(cache.findObjectRef(CommentType, { id: commentId })!)
    },
  }
)
