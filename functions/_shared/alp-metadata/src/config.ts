import { UserConfigType } from 'types'

export const defaultUserConfig: UserConfigType = {
  graphqlEndpoint: Deno.env.get("ALP_PORTAL_GRAPHQL_ENDPOINT")!
}
