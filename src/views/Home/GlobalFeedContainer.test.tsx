import React from "react"
import { screen, waitForElementToBeRemoved } from "@testing-library/react"
// import userEvent from "@testing-library/user-event"
// import {
//   server as mockServer,
//   graphql as mswGraphql,
// } from "../__helpers__/mocks/server"
import { allArticles } from "../../__tests__/__helpers__/mocks/data"

import GlobalFeedContainer from "./GlobalFeedContainer"
import config from "../../common/config"
import { renderWithProviders } from "../../__tests__/__helpers__/render"

const { pageSize } = config.pagination

// it("shows loading state", async () => {
//   renderWithProviders(<GlobalFeedContainer />)
//   expect(screen.getByText(/loading/i)).toBeInTheDocument()
// })

// it("shows loading error", async () => {
//   const errMsg = "error for testing"

//   mockServer.use(
//     mswGraphql.query("GetGlobalFeed", (req, res, ctx) => {
//       return res(ctx.errors([{ message: errMsg }]))
//     })
//   )

//   renderWithProviders(<GlobalFeedContainer />)
//   // await waitForElementToBeRemoved(screen.getByText(/loading/i))
//   expect(await screen.findByText(`Error: ${errMsg}`)).toBeInTheDocument()
// })

// it("shows blank global feed", async () => {
//   mockServer.use(
//     mswGraphql.query<GlobalFeedQueryResult>(
//       "GetGlobalFeed",
//       (req, res, ctx) => {
//         return res(ctx.data({ articles: { articlesCount: 0, articles: [] } }))
//       }
//     )
//   )

//   renderWithProviders(<GlobalFeedContainer />)
//   // await waitForElementToBeRemoved(screen.getByText(/loading/i))
//   expect(await screen.findByText("No articles found.")).toBeInTheDocument()
// })

it("shows global feed's first page", async () => {
  renderWithProviders(<GlobalFeedContainer />)
  await waitForElementToBeRemoved(screen.getByText(/loading/i))

  allArticles
    .slice(0, pageSize)
    .forEach((a) => expect(screen.getByText(a.title)).toBeInTheDocument())
})

// it("shows global feed's third page", async () => {
//   renderWithProviders(<GlobalFeedContainer />)

//   userEvent.click(await screen.findByRole("link", { name: "3" }))
//   await waitForElementToBeRemoved(screen.getByText(/loading/i))

//   allArticles
//     .slice(pageSize * 2, pageSize * 3)
//     .forEach((a) => expect(screen.getByText(a.title)).toBeInTheDocument())

//   // prettier-ignore
//   expect(screen.getByRole("link", { name: "3" }).parentElement).toHaveClass("active")
// })
