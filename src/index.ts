import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// this is the schema
// it is a collection of type definitons which define the shape of queries
// that are executed against data 
const typeDefs = `
  type Product {
    name: String
    options: [String]
  }

 # type ProductVariant {
 #   product: Product
 #   variantOptions: [String]
 #   price: Int  
 # }

 # type Option {
 #   choices: [String]
 # }

 # type Collection {
 #   products: [Product]
 # }

  # special type
  # it list all queries that a client can execute
  # with the return type for each
  type Query {
    product(name: String): Product
    products: [Product]
  }
`;

// dataset which matches the Book type definition
const products = [
    {
        name: "Unicolor shirt",
        options: ["size", "color"]
    },
    {
        name: "Polo Shirt",
        options: ["collar", "size", "color"]
    } 
];


// Resolvers are what links the dataset to the Query type 
const resolvers = {
    Query: {
        product: (parent, args, contextValue, info) => {
            for (let product of products){
                console.log(product.name)
                console.log(args.name)
                if (product.name == args.name)
                    return product
            }
            return null
        },
        products: () => products,
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server ready at: ${url}`);
