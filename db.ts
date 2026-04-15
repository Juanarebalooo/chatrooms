import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
dotenv.config();
const serviceAccount = JSON.parse(process.env.KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: process.env.DATABASE_URL,
});

const firestore = admin.firestore();
const rtdb = admin.database();
export { firestore, rtdb };
