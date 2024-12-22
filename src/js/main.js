import "../styles/styles.scss";
import isDomLoaded from "./utils/isDomLoaded.js";
import { ModalManager } from "./modules/ModalManager";
import { FormHandler } from "./modules/FormHandler.js";
import { FormValidator } from "./modules/FormValidator.js";
import { ScrollManager } from "./utils/ScrollManager.js";

isDomLoaded(() => {
  new ModalManager();
  new FormHandler();
  new FormValidator();
  new ScrollManager();
});
