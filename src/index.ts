import { state } from "./state";
import { initHome } from "./pages";
import { initChat } from "./pages/chat";
import { rtdbCl } from "../rtdb";
import "./router";
(function () {
  initHome();
  initChat();
})();
