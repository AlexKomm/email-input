import "./email-input.scss";

import { isEmailValid } from "./utils";

((global) => {
  const createSelectionContainer = () => {
    const selectionContainer = document.createElement("div");
    selectionContainer.classList.add("email-input");

    return selectionContainer;
  };

  const createList = () => {
    const listNode = document.createElement("ul");
    listNode.classList.add("email-input__list");

    return listNode;
  };

  const createListItem = () => {
    const listItem = document.createElement("li");
    listItem.classList.add("email-input__item");

    return listItem;
  };

  const createEmailInput = (placeholder) => {
    const inputField = document.createElement("input");
    inputField.classList.add("email-input__input");

    inputField.setAttribute("type", "text");
    inputField.setAttribute("placeholder", placeholder);

    return inputField;
  };

  const createEmailItem = (email) => {
    const emailNode = createListItem();
    emailNode.classList.add("email-input__item--email");
    emailNode.textContent = email.value;

    if (!email.valid) {
      emailNode.classList.add("email-input__item--invalid");
    }

    const removeIcon = document.createElement("span");
    removeIcon.classList.add("email-input__remove");
    removeIcon.setAttribute("title", "Remove this email");
    removeIcon.textContent = "x";

    emailNode.appendChild(removeIcon);

    return emailNode;
  };

  const replaceEmails = (listNode, emails) => {
    while (listNode.childNodes.length > 1) {
      listNode.removeChild(listNode.firstChild);
    }

    const emailItemsFragment = emails.reduce((acc, email) => {
      const emailItem = createEmailItem(email);

      acc.appendChild(emailItem);
      return acc;
    }, document.createDocumentFragment());

    listNode.insertBefore(emailItemsFragment, listNode.lastChild);
  };

  const removeEmail = (listNode, position) => {
    listNode.removeChild(listNode.childNodes[position]);
  };

  const appendEmails = (listNode, ...emails) => {
    const emailItemsFragment = emails.reduce((acc, email) => {
      const emailItem = createEmailItem(email);

      acc.appendChild(emailItem);
      return acc;
    }, document.createDocumentFragment());

    listNode.insertBefore(emailItemsFragment, listNode.lastChild);
  };

  const isEmailAlreadyAdded = (email, existingEmails) => {
    return existingEmails.some((current) => current.value === email);
  };

  const defaultOptions = {
    placeholder: "Add more",
    initialEmails: [],
    onListChange: null,
  };

  class EmailInput {
    onListChange;

    emails = [];

    constructor(element, options = {}) {
      this.element = element;

      options = { ...defaultOptions, ...options };

      if (options.onListChange) {
        this.onListChange = options.onListChange;
      }

      const emailsList = createList();
      const emailInput = createEmailInput(options.placeholder);

      const listItem = createListItem();
      listItem.classList.add("email-input__item--input");
      listItem.appendChild(emailInput);

      emailsList.appendChild(listItem);

      const selectionContainer = createSelectionContainer();
      selectionContainer.appendChild(emailsList);

      this.element.appendChild(selectionContainer);

      this.setEmails(...options.initialEmails);

      const handleClick = (e) => {
        if (e.target.classList.contains("email-input__remove")) {
          const listItem = e.target.parentElement;
          const removedItemIndex = [...listItem.parentElement.children].indexOf(
            listItem
          );

          this.emails.splice(removedItemIndex, 1);
          removeEmail(emailsList, removedItemIndex);

          if (this.onListChange) {
            this.onListChange(this.emails);
          }
        }
      };

      const handleInput = (e) => {
        if (e.data === ",") {
          const email = e.target.value.slice(0, -1);

          if (email.length === 0) {
            return;
          }

          if (!isEmailAlreadyAdded(email, this.emails)) {
            const emailRecord = { value: email, valid: isEmailValid(email) };

            this.emails.push(emailRecord);
            appendEmails(emailsList, emailRecord);

            if (this.onListChange) {
              this.onListChange(this.emails);
            }
          }

          emailInput.value = "";
        }
      };

      const handleFocusOut = (e) => {
        if (e.target.classList.contains("email-input__input")) {
          const email = e.target.value;

          if (email.length > 0) {
            if (!isEmailAlreadyAdded(email, this.emails)) {
              const emailRecord = { value: email, valid: isEmailValid(email) };

              this.emails.push(emailRecord);
              appendEmails(emailsList, emailRecord);

              if (this.onListChange) {
                this.onListChange(this.emails);
              }
            }

            emailInput.value = "";
          }
        }
      };

      const handlePaste = (e) => {
        const input = e.clipboardData.getData("text/plain");

        if (input.length > 0) {
          const pastedEmails = input.split(",").reduce((acc, item) => {
            const email = item.trim();

            if (email.length > 0 && !isEmailAlreadyAdded(email, this.emails)) {
              acc.push({ value: email, valid: isEmailValid(email) });
            }

            return acc;
          }, []);

          this.emails.push(...pastedEmails);
          appendEmails(emailsList, ...pastedEmails);

          e.preventDefault();

          if (this.onListChange) {
            this.onListChange(this.emails);
          }
        }
      };

      selectionContainer.addEventListener("click", handleClick);
      selectionContainer.addEventListener("input", handleInput);
      selectionContainer.addEventListener("focusout", handleFocusOut);
      selectionContainer.addEventListener("paste", handlePaste);
    }

    setEmails(...emails) {
      this.emails = emails.map((email) => {
        return { value: email, valid: isEmailValid(email) };
      });

      const list = this.element.querySelector(".email-input__list");
      replaceEmails(list, this.emails);

      if (this.onListChange) {
        this.onListChange(this.emails);
      }

      return this;
    }
  }

  global.EmailInput = EmailInput;
})(window);
