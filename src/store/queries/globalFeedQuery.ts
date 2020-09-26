import { Query } from "react-kho"

import { getGlobalFeed } from "../../api"
export const globalFeedQuery = new Query("GlobalFeed", getGlobalFeed)
