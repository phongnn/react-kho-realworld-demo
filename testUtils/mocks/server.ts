import { setupServer } from "msw/node"
import { handlers } from "./handlers"

export { graphql } from "msw"
export const server = setupServer(...handlers)
