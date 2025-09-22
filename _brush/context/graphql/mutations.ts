export const CREATE_STOREFRONT_ACCESS_TOKEN =
  /* GraphQL */
  `
    mutation StorefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
      storefrontAccessTokenCreate(input: $input) {
        storefrontAccessToken {
          accessToken
        }
      }
    }
  `;
