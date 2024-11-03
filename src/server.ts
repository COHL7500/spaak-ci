import {ApolloServer} from "apollo-server";
import {typeDefs} from "@/graphql/schema";
import {resolvers} from "@/graphql/resolvers";

const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
server.listen({ port: 4000 }).then(({ url }: {url: any}) => {
    console.log(`🚀 Server ready at ${url}`);
});
