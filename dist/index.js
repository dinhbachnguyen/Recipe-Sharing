import { ApolloServer } from '@apollo/server';
import { MongoClient, ObjectId } from 'mongodb';
import { startStandaloneServer } from '@apollo/server/standalone';
const typeDefs = `#graphql
  type Recipe {
    _id: ID!
    name: String
    description: String
    ingredient: String
    recipe: String
    rating: String
    comment: String
  }


  type Query {
    recipes: [Recipe]
  }

  type Mutation {
    addRecipe(name: String, description: String, ingredient: String, recipe: String, rating: String, comment: String): Recipe
    deleteRecipe(_id: ID): DeleteRecipeResponse
  }

  type DeleteRecipeResponse {
    success: Boolean
    message: String
  }
`;
const MONGODB_URI = 'mongodb+srv://User:123@cluster0.1jemefc.mongodb.net/';
const MONGODB_DB_NAME = 'Restaurant';
const MONGODB_COLLECTION_NAME = 'Recipe';
const connectToDatabase = async () => {
    const client = new MongoClient(MONGODB_URI, {});
    await client.connect();
    return client.db(MONGODB_DB_NAME).collection(MONGODB_COLLECTION_NAME);
};
const resolvers = {
    Query: {
        recipes: async () => {
            const collection = await connectToDatabase();
            return collection.find({}).toArray();
        },
    },
    Mutation: {
        addRecipe: async (_, { name, description, ingredient, recipe, rating, comment }) => {
            const collection = await connectToDatabase();
            const newRecipe = {
                name,
                description,
                ingredient,
                recipe,
                rating,
                comment
            };
            await collection.insertOne(newRecipe);
            return newRecipe;
        },
        deleteRecipe: async (_, { _id }) => {
            const collection = await connectToDatabase();
            try {
                const objectId = new ObjectId(_id);
                const result = await collection.deleteOne({ _id: objectId });
                if (result.deletedCount === 1) {
                    console.log(`Recipe with id ${_id} deleted successfully.`);
                    return { success: true };
                }
                else {
                    console.log(`Recipe with id ${_id} not found or could not be deleted.`);
                    return { success: false, message: 'Recipe not found or could not be deleted.' };
                }
            }
            catch (error) {
                console.error('Error deleting recipe:', error);
                return { success: false, message: 'An error occurred during recipe deletion.' };
            }
        },
    },
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
//# sourceMappingURL=index.js.map