class EmailStorage {
  subscribers = {};

  constructor(emails = []) {
    this.data = emails;
  }

  on(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }

    this.subscribers[event].push(callback);
  }

  trigger(event, ...data) {
    if (this.subscribers[event] && this.subscribers[event].length > 0) {
      this.subscribers[event].forEach((cb) => cb(...data));
    }
  }

  remove(pos) {
    const removedItem = this.data.splice(pos, 1);
    this.trigger("remove", removedItem, pos, this.data);
  }

  append(...emails) {
    const dataToAppend = emails.map((item) => {
      return { value: item, valid: this.isValid(item) };
    });
    this.data.push(...dataToAppend);
    this.trigger("append", dataToAppend, this.data);
  }

  replace(newEmails) {
    this.data = newEmails.map((item) => {
      return { value: item, valid: this.isValid(item) };
    });

    this.trigger("replace", this.data);
  }

  exists(email) {
    return this.data.some((current) => current.value === email);
  }

  isValid(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

export default EmailStorage;
