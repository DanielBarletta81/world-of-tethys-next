import { graphqlFetch } from './graphql';

export async function fetchAPI(query, variables = {}) {
  return graphqlFetch(query, variables);
}
// World of Tethys || D.C. Barletta
