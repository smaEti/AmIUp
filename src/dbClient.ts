import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const uri: string = process.env.DBURI!;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export default client;