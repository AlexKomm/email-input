# email-input

## Setup

```
<!-- form header -->
<div id="emails-input"></div>
<!-- form footer, buttons -->
<script src="emails-input.min.js"></script>
<script>
  var inputContainerNode = document.querySelector('#emails-input');
  var emailsInput = new EmailsInput(inputContainerNode, {...options});
</script>
```

All emails are stored in hidden field (delimited by comma) for sending result to the backend.

## Options

### placeholder

Allows to alter placeholder text

```
var emailInput = new EmailInput(inputContainerNode, {
  placeholder: 'alternative placeholder text...'
});
```

## API

### setEmails(arrayOfEmailAddresses)

Replaces all entered emails with new ones

```
emailsInput.setEmails(['email@miro.com', 'alex@gmail.com']);
```

### getEmails()

Returns list of all email addresses

```
emailsInput.getEmails() // ['email@miro.com', 'alexander@miro.com']
```

### emails

Reference to email storage. See below for more information

## Events

You can subscribe directly to EmailStorage events:

### append

Event is fired when email is appended to list. This happens during input and pasting from clipboard

```
emailInput.emails.on("append", function (addedEmails, emails) {
  console.log(["append", addedEmails, emails]);
});
```

### remove

This event is fired when email is removed from list.

```
emailInput.emails.on("remove", function (
  removedItem,
  position,
  emails
) {
  console.log(["remove", removedItem, position, emails]);
});
```

### replace

This event is fired when email list replaced with setEmails method

```
emailInput.emails.on("replace", function (emails) {
  console.log(["replace", emails]);
});
```

## EmailStorage

### append(...emails)

Appends to the list of emails

### remove(position)

Removes email by list position

### replace(emails)

Replaces email list

### on(event, callback)

Subscribes to events: append, replace, remove

### trigger(event)

Triggers event

### isValid(email)

Validates email and returns boolean

### exists(email)

Check if provided email already exists

