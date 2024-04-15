import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// this is the schema
// it is a collection of type definitons which define the shape of queries
// that are executed against data 
const typeDefs = `
  type Product {
    name: String
    options: [String]
    price: Int #in cents
    collection: String
  }

  type Option {
    name: String
    choices: [String]
  }

  type ProductWithOptions {
      name: String
      options: [Option]
      price: Int
      collection: String
  }

  # special type
  # it list all queries that a client can execute
  # with the return type for each
  type Query {
    products: [Product]
    product(name: String): Product
    getCollection(name: String): [Product] 
    getOptions(name: String): [String]
    getProductWithOptions(name: String): ProductWithOptions 
  }
`;

// dataset which matches the Product type definition
const products = [
    {
        name: "Unicolor shirt",
        options: ["size", "color"],
        price: 2000,
        collection: "Shirts",
    },
    {
        name: "Polo shirt",
        options: ["collar", "size", "color"],
        price: 4000,
        collection: "Polos",
    }, 
];
// dataset which matches the options type definition
const options = [
    {
        name: "size",
        choices: ["XS", "S", "M", "L", "XL"],
    },
    {
        name: "color",
        choices: ["red", "yellow", "gray", "white"],
    },
    {
        name: "collar",
        choices:  ["normal", "wide"],
    },
]


// Resolvers are what link the data to the query 
const resolvers = {
    Query: {
        products: () => products,
        product: (parent, args, contextValue, info) => {
            for (let product of products){
                if (product.name == args.name)
                    return product
            }
            return null;
        },
        getCollection: (parent, args, contextValue, info) => {
                let res = products.filter((product) => product.collection == args.name);
                return res;
        },
        getOptions: (parent, args, contextValue, info) => {
            for (let option of options){
                if (option.name == args.name)
                    return option.choices;
            }
            return null;
        },
        // This is to get the product with options extended
        getProductWithOptions: (parent, args, contextValue, info) => {
            let prod = null
            for (let product of products){
                if (product.name == args.name)
                    prod = product
            }
            if (prod == null) return null;
            return {
                ...prod,
                options: options.filter((option) => prod.options.includes(option.name))
            };
        }
    },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server ready at: ${url}`);
