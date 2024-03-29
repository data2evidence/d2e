import { UserConfigType } from 'types'

export const defaultUserConfig: UserConfigType = {
  graphqlEndpoint: process.env.ALP_PORTAL_GRAPHQL_ENDPOINT!
}
