import firebase from "firebase/compat/app";
import "firebase/compat/database";
import * as dotenv from "dotenv";
dotenv.config();
const rtdb_data = JSON.parse(process.env.RTDB_DATA);
const app = firebase.initializeApp(rtdb_data);

const rtdbCl = firebase.database();

export { rtdbCl };
