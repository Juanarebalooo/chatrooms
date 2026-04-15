import firebase from "firebase/compat/app";
import "firebase/compat/database";

const rtdb_data = JSON.parse(process.env.RTDB_DATA);
const app = firebase.initializeApp(rtdb_data);

const rtdbCl = firebase.database();

export { rtdbCl };
