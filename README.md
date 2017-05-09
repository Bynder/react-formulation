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
            minLength: minLength: condition => `Please use a minimum of ${condition} characters`,
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
