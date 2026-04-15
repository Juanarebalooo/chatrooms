import { state } from "../state";
import _ from "lodash";
export function initChat() {
  customElements.define(
    "chat-el",
    class Chat extends HTMLElement {
      connectedCallback() {
        this.render();
        state.setMessagesOnState(() => {
          this.renderMessages(state.getState().messages);
        });
      }
      render() {
        console.log(state.data.roomId);

        this.innerHTML = `
        <div class="header"></div>
        <h1 class="title">Chat</h1>
        <h3 class="sub-title">room id:${state.data.roomId}</h3>
        <div class="container">       
        <ul class="messages-container"></ul>
        <input type="text" class="message" name="message">
        <button class="button">Enviar</button>
        </div>        
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
        .sub-title{
        margin-left:32px;
        margin-top:0;
        margin-bottom:14px;
        font-size:25px;
        font-weight:700;
        font-family:Roboto;
        }
        .messages-container {
        flex: 1 1 auto;                  
        overflow-y: auto;                
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px 0;
        list-style: none;
        scrollbar-width: none;       
        min-height: 0;                               
        }
        .container{
        width:100%;
        height:71vh;
        display:flex;
        flex-direction:column;
        padding:0 32px;
        gap:10px;
        }
        .message {
        height:55px;
        font-size:20px;
        font-family:Roboto;
        padding:0 10px;
        border-radius:4px;
        border:solid 2px;
        margin-top:auto;
        }
        .button{
        height:55px;
        font-size:24px;
        font-family:Roboto;
        font-weight:500;
        border-radius:4px;
        border:none;
        background-color:#9CBBE9;
        margin-bottom: 45px;
        }
       
        `;
        this.appendChild(style);
        const buttonEl = this.querySelector(".button");

        buttonEl.addEventListener("click", () => {
          const message = {
            message: {
              nombre: "",
              email: "",
              mensaje: "",
            },
          };
          const currentState = state.getState();
          const messagesInput = this.querySelector(
            'input[name="message"]',
          ) as HTMLInputElement;
          const messagesValue = messagesInput.value;
          message.message.email = currentState.email;
          message.message.nombre = currentState.fullName;
          message.message.mensaje = messagesValue;
          console.log(message);

          state.setMessages(message, () => {
            state.setMessagesOnState(() => {
              this.renderMessages(state.getState().messages);
            });
          });
          messagesInput.value = "";
        });
      }
      renderMessages(messages) {
        console.log("mensajes a renderizar:", messages);

        const messagesContainer = this.querySelector(".messages-container");
        messagesContainer.innerHTML = "";
        _.forEach(messages, (message) => {
          const messageEl = document.createElement("li");
          messageEl.textContent = `${message.nombre}: ${message.mensaje}`;
          messageEl.style.border = "none";
          messageEl.style.borderRadius = "4px";
          messageEl.style.backgroundColor = "#B9E97C";
          if (message.email === state.getState().email) {
            messageEl.style.marginLeft = "auto";
          } else {
            messageEl.style.marginRight = "auto";
            messageEl.style.backgroundColor = "#D8D8D8";
          }
          messagesContainer.appendChild(messageEl);
        });
      }
    },
  );
}
