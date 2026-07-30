import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`,
    credentials: "include", // sends the session cookie with every request
  }),
  cache: new InMemoryCache(),
});