import { firestore, rtdb } from "./db";
import express from "express";
import { nanoid } from "nanoid";
import cors from "cors";
import { log } from "firebase/firestore/pipelines";
import e from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as dotenv from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
const usersCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");
app.post("/signup", (req, res) => {
  const email = req.body.email;
  const nombre = req.body.nombre;
  usersCollection
    .where("email", "==", email)
    .get()
    .then((response) => {
      if (response.empty) {
        usersCollection
          .add({
            email,
            nombre,
          })
          .then((newUserRef) => {
            res.json({
              id: newUserRef.id,
              new: true,
            });
          });
      } else {
        res.status(400).json({
          message: "Ya existe un user con ese email",
        });
      }
    });
});

app.post("/auth", (req, res) => {
  const { email } = req.body;
  usersCollection
    .where("email", "==", email)
    .get()
    .then((response) => {
      if (response.empty) {
        res.status(404).json({ message: "not found" });
      } else {
        res.json({
          id: response.docs[0].id,
        });
      }
    });
});

app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  usersCollection
    .doc(userId.toString())
    .get()
    .then((snap) => {
      if (snap.exists) {
        const roomRef = rtdb.ref("rooms/" + nanoid());
        roomRef
          .set({
            messages: [],
            owner: userId,
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);
            roomsCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                });
              });
          });
      } else {
        res.status(401).json({
          message: "No existís",
        });
      }
    });
});
app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;
  usersCollection
    .doc(userId.toString())
    .get()
    .then((snap) => {
      if (snap.exists) {
        roomsCollection
          .doc(roomId)
          .get()
          .then((snap) => {
            const data = snap.data();
            res.json(data);
          });
      } else {
        res.status(401).json({
          message: "No existís",
        });
      }
    });
});
app.post("/rooms/:rtdbRoomId", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { message } = req.body;
  const roomRef = rtdb.ref(`rooms/${rtdbRoomId}/messages`);
  roomRef
    .push(message)
    .then(() => {
      res.status(200).json({ message: "Mensaje enviado" });
    })
    .catch((error) => {
      console.log("Error al enviar el mensaje ", error);
      res.status(500).json({ error: "Error al enviar el mensaje" });
    });
});
app.use(express.static("dist"));

app.get("/*path", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
