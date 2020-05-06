import "./email-input.scss";

import EmailStorage from './email-storage';

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

  const createHidden = () => {
    const inputField = document.createElement("input");
    inputField.setAttribute("type", "hidden");
    inputField.value = '';

    return inputField;
  }

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

  const appendEmails = (listNode, emails) => {
    const emailItemsFragment = emails.reduce((acc, email) => {
      const emailItem = createEmailItem(email);

      acc.appendChild(emailItem);
      return acc;
    }, document.createDocumentFragment());

    listNode.insertBefore(emailItemsFragment, listNode.lastChild);
  };

  const defaultOptions = {
    placeholder: "Add more",
    initialEmails: [],
    onListChange: null,
  };

  class EmailInput {
    emails = new EmailStorage();

    constructor(element, options = {}) {
      this.element = element;

      options = { ...defaultOptions, ...options };

      const emailsList = createList();
      const emailInput = createEmailInput(options.placeholder);
      const resultHidden = createHidden();

      const listItem = createListItem();
      listItem.classList.add("email-input__item--input");
      listItem.appendChild(emailInput);

      emailsList.appendChild(listItem);

      const selectionContainer = createSelectionContainer();
      selectionContainer.appendChild(emailsList);
      selectionContainer.appendChild(resultHidden);

      this.element.appendChild(selectionContainer);

      const handleClick = (e) => {
        if (e.target.classList.contains("email-input__remove")) {
          const listItem = e.target.parentElement;
          const removedItemIndex = [...listItem.parentElement.children].indexOf(
            listItem
          );

          this.emails.remove(removedItemIndex);
        }
      };

      const handleInput = (e) => {
        if (e.data === ",") {
          const email = e.target.value.slice(0, -1);

          if (email.length === 0) {
            return;
          }

          if (!this.emails.exists(email)) {
            this.emails.append(email);
          }

          emailInput.value = "";
        }
      };

      const handleFocusOut = (e) => {
        if (e.target.classList.contains("email-input__input")) {
          const email = e.target.value;

          if (email.length > 0) {
            if (!this.emails.exists(email)) {
              this.emails.append(email);
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

            if (email.length > 0 && !this.emails.exists(email)) {
              acc.push(email);
            }

            return acc;
          }, []);

          this.emails.append(...pastedEmails);

          e.preventDefault();
        }
      };

      if (options.onListChange) {
        this.onListChange = options.onListChange;
      }

      this.emails.on("append", (addedEmails) => {
        appendEmails(emailsList, addedEmails);
        resultHidden.value = this.getEmails().join(',');
      });

      this.emails.on("remove", (removedItem, position) => {
        removeEmail(emailsList, position);
        resultHidden.value = this.getEmails().join(',');
      });

      this.emails.on("replace", (emails) => {
        replaceEmails(emailsList, emails);
        resultHidden.value = this.getEmails().join(',');
      });

      selectionContainer.addEventListener("click", handleClick);
      selectionContainer.addEventListener("input", handleInput);
      selectionContainer.addEventListener("focusout", handleFocusOut);
      selectionContainer.addEventListener("paste", handlePaste);
    }

    getEmails() {
      return this.emails.data.map((item) => item.value);
    }

    setEmails(emails) {
      this.emails.replace(emails);
    }
  }

  global.EmailInput = EmailInput;
})(window);
