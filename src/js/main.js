import "../styles/styles.scss";
import { ModalManager } from "./modules/ModalManager";
import { FormHandler } from "./modules/FormHandler.js";
import { FormValidator } from "./modules/FormValidator.js";
import { ScrollManager } from "./utils/ScrollManager.js";

document.addEventListener("DOMContentLoaded", () => {
  new ModalManager();
  new FormHandler();
  new FormValidator();
  new ScrollManager();
})