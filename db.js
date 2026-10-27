import { MongoClient } from "mongodb";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const client = new MongoClient(
  "mongodb+srv://marawanalaam_db_user:s0htSBdiF4nxTD9J@cluster0.4t5w8kl.mongodb.net/",
);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await client.close();
}

export async function getCollectionName(name) {
  await client.connect();
  const db = await client.db("sample_mflix");
  return db.collection(name);
}
