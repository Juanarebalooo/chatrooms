import { Router } from "@vaadin/router";
import { state } from "../state";
export function initHome() {
  customElements.define(
    "home-el",
    class Home extends HTMLElement {
      connectedCallback() {
        this.render();
      }
      render() {
        this.innerHTML = `
      <div class="header"></div>
      <h1 class="title">Bienvenidos</h1>
      <form class="form">
       <div class="subcont">
       <label class="label">email</label>
       <input type="email" class="input" name="email">
       </div>
       <div class="subcont">
       <label class="label">tu nombre</label>
       <input type="text" class="input" name="nombre">
       </div>
       <div class="subcont">
       <label class="label">room</label>
       <select class="select">
       <option value="new-room">Nuevo room</option>
       <option value="room">Room existente</option>
       </select>
       </div>
       <div class="subcont-room-id">
       <label class="label">room id</label>
       <input type="text" class="input" name="room-id">
       </div>
       <button class="button">Comenzar</button>
      </form>
      `;
        const style = document.createElement("style");
        style.textContent = `
        .header{
        width:100%;
        height:60px;
        background-color:#FF8282;
        }
        .title{
        margin-left:32px;
        margin-top:14px;
        margin-bottom:14px;
        font-size:52px;
        font-weight:700;
        font-family:Roboto;
        }
        .form{
        width:100%;
        height:77vh;
        display:flex;
        flex-direction:column;
        padding:0 32px;
        gap:10px;
        }
        .subcont, .subcont-room-id{
        display:flex;
        flex-direction:column;
        }
        .subcont-room-id{
        display:none;
        }
        .label{
        font-size:24px;
        font-weight:500;
        font-family:Roboto;
        }
        .input, .select {
        height:55px;
        font-size:20px;
        font-family:Roboto;
        padding:0 10px;
        border-radius:4px;
        border:solid 2px;
        }
        .button{
        height:55px;
        font-size:24px;
        font-family:Roboto;
        font-weight:500;
        border-radius:4px;
        border:none;
        background-color:#9CBBE9;
        margin-top: auto;
        margin-bottom: 45px;
        }
        `;
        this.appendChild(style);
        const selectEl = this.querySelector(".select") as HTMLSelectElement;
        const roomIdEl = this.querySelector(".subcont-room-id") as HTMLElement;
        const formEl = this.querySelector(".form") as HTMLFormElement;
        selectEl.addEventListener("change", () => {
          if (selectEl.value === "room") {
            roomIdEl.style.display = "flex";
          } else {
            roomIdEl.style.display = "none";
          }
        });
        formEl.addEventListener("submit", (e) => {
          e.preventDefault();
          const emailInput = formEl.querySelector(
            'input[name="email"]',
          ) as HTMLInputElement;
          const emailVal = emailInput.value;
          const nameInput = formEl.querySelector(
            'input[name="nombre"]',
          ) as HTMLInputElement;
          const nameVal = nameInput.value;
          const roomIdInput = formEl.querySelector(
            'input[name="room-id"]',
          ) as HTMLInputElement;
          const roomIdVal = roomIdInput.value;
          if (selectEl.value === "new-room") {
            state.setEmailAndFullName({ email: emailVal, fullname: nameVal });
            state.signUp(() => {
              state.signIn(() => {
                state.createRooms(() => {
                  state.setRoomKey(() => {
                    Router.go("/chat");
                  });
                });
              });
            });
          } else {
            state.setEmailAndFullName({ email: emailVal, fullname: nameVal });
            state.signUp(() => {
              state.signIn(() => {
                state.setRoomId(roomIdVal, () => {
                  state.setRoomKey(() => {
                    Router.go("/chat");
                  });
                });
              });
            });
          }
        });
      }
    },
  );
}
