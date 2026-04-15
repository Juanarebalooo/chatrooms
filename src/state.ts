import { rtdbCl } from "../rtdb";

const API_BASE_URL = "https://chatrooms-y1r5.onrender.com";
const state = {
  data: {
    email: "",
    fullName: "",
    userId: "",
    roomId: "",
    messages: {},
    rtdbRoomId: "",
  },
  listeners: [],
  getState() {
    return this.data;
  },
  setState(newState: any) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    console.log("Soy el state y he cambiado", this.data);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  setEmailAndFullName(params: { email: string; fullname: string }) {
    const currentState = this.getState();
    currentState.email = params.email;
    currentState.fullName = params.fullname;
    this.setState(currentState);
  },
  signUp(callback) {
    const currentState = this.getState();
    if (currentState.email && currentState.fullName) {
      fetch(API_BASE_URL + "/signup", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: currentState.email,
          nombre: currentState.fullName,
        }),
      })
        .then(() => {
          console.log("User register");
          callback();
        })
        .catch(() => {
          callback();
        });
    }
  },
  signIn(callback) {
    const currentState = this.getState();
    fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: currentState.email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la autenticación");
        }
        return response.json();
      })
      .then((data) => {
        if (data.id) {
          currentState.userId = data.id;
          this.setState(currentState);
          callback();
        } else {
          console.error("No se encontro el user");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },
  createRooms(callback) {
    const currentState = this.getState();
    if (currentState.userId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId: currentState.userId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          currentState.roomId = data.id;
          this.setState(currentState);
          callback();
        });
    } else {
      console.error("Ocurrio un problema al intentar crear una room");
    }
  },
  setRoomKey(callback?) {
    const currentState = this.getState();
    if (currentState.roomId && currentState.userId) {
      fetch(
        API_BASE_URL +
          "/rooms" +
          "/" +
          currentState.roomId +
          "?userId=" +
          currentState.userId,
        {
          method: "get",
        },
      )
        .then((res) => res.json())
        .then((data) => {
          currentState.rtdbRoomId = data.rtdbRoomId;
          this.setState(currentState);
          if (callback) callback();
        });
    } else {
      console.error("Hubo un error");
    }
  },
  setRoomId(roomId, callback) {
    const currentState = this.getState();
    currentState.roomId = roomId;
    this.setState(currentState);
    callback();
  },
  setMessages(messages, callback) {
    const currentState = this.getState();

    fetch(API_BASE_URL + "/rooms/" + currentState.rtdbRoomId, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(messages),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al enviar el mensaje");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Mensaje enviado correctamente", data);
        callback();
      })
      .catch((error) => {
        console.error("Error al enviar el mensaje", error);
      });
  },
  setMessagesOnState(callback) {
    const currentState = this.getState();
    const messagesRef = rtdbCl.ref(`rooms/${currentState.rtdbRoomId}/messages`);
    messagesRef.on("value", (snap) => {
      const messagesValue = snap.val();
      currentState.messages = messagesValue;
      this.setState(currentState);
      callback();
    });
  },
};
export { state };
