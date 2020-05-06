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

## Options

### placeholder

Allows to alter placeholder text

```
var emailInput = new EmailInput(inputContainerNode, {
  placeholder: 'alternative placeholder text...'
});
```

### initialEmails

List of initial email values

```
var emailInput = new EmailInput(inputContainerNode, {
  initialEmails: ['john@miro.com', 'akommv@gmail.com', 'foobar@bar.bazz']
});
```

## API

### setEmails(arrayOfEmailAddresses)

Replaces all entered emails with new ones

```
emailsInput.setEmails(['email@miro.com', 'alex@gmail.com']);
```

### emails

Returns list of all email addresses and flag indicating whether each email address is valid or not

```
emailsInput.emails // [{ value: 'email@miro.com', valid: true }, { value: 'foobar', valid: false }]
```

### onListChange

Setter for listening email list changes event. It can also be set during initialization phase with initialOptions parameter 'onListChange'. Callback function accepts one parameter - array of all added emails.

```
var emailInput = new EmailInput(inputContainerNode, {
  onListChange: function(emails) {
    console.log(emails);
  },
});
```
or
```
emailInput.onListChange = function(addedEmails) {
  console.log(addedEmails);
}
```

