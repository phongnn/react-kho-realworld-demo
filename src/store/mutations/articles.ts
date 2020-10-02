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

export const createArticleMutation = new Mutation(
  "CreateArticle",
  (args: {
    title: string
    description: string
    body: string
    tags: string[]
  }) => createArticle(args),
  {
    shape: ArticleType,
    afterQueryUpdates(store) {
      // store.refetchQueries([]) // TODO: refetch "MyArticles"
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
      tags: string[]
    }
  }) => updateArticle(args.slug, args.input),
  {
    shape: ArticleType,
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
    shape: ArticleType,
  }
)

export const createCommentMutation = new Mutation(
  "CreateComment",
  (args: { slug: string; comment: string }) =>
    createComment(args.slug, { body: args.comment }),
  {
    shape: CommentType,
    beforeQueryUpdates(
      cache,
      { mutationArgs: { slug }, mutationResult: commentRef }
    ) {
      const article = cache.readObject(
        cache.findObjectRef(ArticleType, { slug })!
      )
      article.comments = [...(article.comments || []), commentRef]
    },
  }
)

export const deleteCommentMutation = new Mutation(
  "DeleteComment",
  (args: { slug: string; commentId: string }) =>
    deleteComment(args.slug, args.commentId),
  {
    shape: CommentType,
    beforeQueryUpdates(cache, { mutationArgs: { commentId } }) {
      // const article = cache.readObject(
      //   cache.findObjectRef(ArticleType, { slug })!
      // )
      // article.comments = article.comments.filter((c: any) => !c.key.matches(commentId))

      cache.deleteObject(cache.findObjectRef(CommentType, { id: commentId })!)
    },
  }
)