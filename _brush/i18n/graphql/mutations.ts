export const THEME_FILE =
  /* GraphQL */
  `
    query GetThemeFile($id: ID!, $filenames: [String!]!) {
      theme(id: $id) {
        id
        name
        role
        files(filenames: $filenames, first: 20) {
          nodes {
            filename
            body {
              ... on OnlineStoreThemeFileBodyText {
                content
              }
            }
          }
        }
      }
    }
  `;
