export const GET_LIVE_THEME =
  /* GraphQL */
  `
    query GetLiveTheme {
      themes(first: 1, roles: MAIN) {
        nodes {
          id
        }
      }
    }
  `;
