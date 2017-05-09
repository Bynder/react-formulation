# React Formulation
Easy form validation

## Installation
```
npm install @bynder/react-formulation --save
```

## Demo
If you want to try out a little demo first:
```
git clone git@github.com:Bynder/react-formulation.git
cd react-formulation
npm install
npm start
```

## Usage
React formulation offers two types of forms. The first one is a high order component for larger forms, the second one is a component for a form with just one input field and a submit and cancel button.

### HOC
If you have a larger form you'll use the High order component:

```javascript
import { withValidation, Validator } from '@bynder/react-formulation';

@withValidation({
    validateOn: 'change', // optional, default value is 'blur'
    schema: {
        firstname: {
            required: true,
        },
        lastname: {
            minLength: 2,
            maxLenght: 30,
        },
        // ...more validation rules
    }
})
class YourForm extends React.Component {
    componentWillMount() {
        this.props.setInitialModel({
        	firstname: 'Foo',
        	lastname: 'Bar',
        });
    }

    onSubmit() {
        // handle submit
    }

    render() {
        // Wrap your entire form in a <Validator.Form> component
        // Add a submit handler
        // Wrap every input in a <Validator> component
        // Provide a name to Validator (must match the name you provided in the schema)
        return (
            <Validator.Form onSubmit={this.onSubmit}>
                <Validator name="firstname">
                    <input />
                </Validator>
                <Validator name="lastname">
                    <input />
                </Validator>
                <button type="submit">Submit</submit>
            </Validator.Form>
        );
    }
}

export default YourForm;
```

### Inline Form
For forms with just a single input you'll use the Inline Form component
```javascript
import { InlineForm } from '@bynder/react-formulation';

// Wrap your input and buttons in an <InlineForm> component.
// Provide the name of your input, validation rules, initial value,
// and optionally custom messages to this component.
// Add an onSubmit handler.
// Wrap the input in a <InlineForm.Field> component.
const YourInlineForm = () => (
    <InlineForm
        name="firstname"
        initialValue="Foo"
        rules={{
            required: true,
            minLength: 2,
            maxLength: 30,
        }}
        messages={{
            // Custom validation messages
            required: 'Please don\'t leave me empty',
            minLength: condition => `Please use a minimum of ${condition} characters`,
        }}
        onSubmit={(val) => { // handle submit }}
    >
        <InlineForm.Field resetOnEscape>
            <label htmlFor="inlineform-name">Name</label>
            <input id="inlineform-name" />
        </InlineForm.Field>
        <InlineForm.Errors /> // (optional) This will display the error messages
        <InlineForm.Cancel> // (optional) This will reset your form when you click cancel
            <button
                type="button"
            >
                Cancel
            </button>
        </InlineForm.Cancel>
        <InlineForm.Submit> // (optional) This disables the submit button if the field isn't valid
            <button type="submit">
                Save
            </button>
        </InlineForm.Submit>
);

export default YourInlineForm;
```

## Advanced
The basic usage might not be enough for you. Luckily we added some advanced options.

### Custom validation rules
Of course you can add your own validation rules to the schema. Here you can see an example of how that might work:

```javascript
@withValidation({
    schema: {
        name: {
            required: true, // default validation
            mustNotContainSpecialCharacters: { // custom validation
                test: val => !(/[^a-zA-Z0-9]/).test(val),
                message: 'This field cannot contain special characters',
            },
        },
        // ...
    }
})
// ...
```

### Custom error messages
In the example above you can see that it's possible to add custom validation rules and custom messages for those rules. You can also add custom messages for the default validation rules. You can use this option to add translations.

```javascript
@withValidation({
    schema: {
        name: {
            required: true,
        },
        // ...
    },
    messages: {
        required: 'This field is required.',
    }
})
// ...
```

## API
The following options are injected by the `react-formulation` high order component.

### `setInitialModel(model: Object)`
Allows you to set the initial values of the model

Usage:
```javascript
this.props.setInitialModel({
    firstname: 'Foo',
    lastname: 'Bar',
});
```

### `isTouched : boolean`
Returns `true` if any of the fields have been changed, otherwise returns `false`.

Usage:
```javascript
this.props.isTouched;
```

### `getSchema(name: String)`
Returns the errors for the given input (name).

Usage:
```javascript
this.props.getSchema('lastname');
```

Returns:
```javascript
// console.log(this.props.getSchema('lastname'));
{
    errors: [{
        condition: true,
        rule: 'required'
    }],
    isTouched: true,
    isValid: false,
}
```

### `schema`
Returns the complete error schema.

Usage:
```javascript
<button disabled={!this.props.schema.isValid && !this.props.isTouched} />
```

Returns:
```javascript
// console.log(this.props.schema);
{
    isValid: true,
    fields: {
        firstname: {
            errors: [],
            isTouched: true,
            isValid: true
        },
        lastname: {
            errors: [{
                condition: true,
                rule: 'required'
            }],
            isTouched: true,
            isValid: false,
        }
    }
}
```

### `validateForm(initialModel: Object [optional])`
Validates the entire form.

Usage:
```javascript
this.props.validateForm();
```

### `setProperty(prop: String, value: Any)`
Set a specific property on a model.

Usage:
```javascript
this.props.setProperty('firstname', 'foo');
```

### `setModel(model: Object)`
Override the existing model

Usage:
```javascript
this.props.setModel({
    firstname: 'bar',
    lastname: 'foo',
});
```

### `isButtonDisabled`
Tells you if your submit button should be disabled.

Usage:
```javascript
<button type="submit" disabled={this.props.isButtonDisabled} />
```

### `resetValidation()`
Removes the validation errors from your form, sets `isValid` to null.

Usage:
```javascript
this.props.resetValidation();
```

Returns:
```javascript
// console.log(this.props.schema);
{
    isValid: null,
    fields: {
        firstname: {
            errors: [],
            isTouched: false,
            isValid: null
        },
        // ...
    }
}
```

### `clearForm()`
Removes all values from all models.

Usage:
```javascript
this.props.clearForm();
```


### `resetForm()`
Resets the validation and sets the form to its initial model.

Usage:
```javascript
this.props.resetForm();
```

### `model`
Returns the complete model.

Usage:
```javascript
this.props.model;
```

Returns
```javascript
{
    firstname: {
        isTouched: false,
        value: 'Foo'
    },
    lastname: {
        isTouched: true,
        value: 'Bar'
    },
    phone: {
        isTouched: false,
        value: '0123456789'
    }
}
```
