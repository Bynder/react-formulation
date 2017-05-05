import React from 'react';
import autobind from 'autobind-decorator';

import { withValidation, Validator } from 'react-formulation';

type Props = {
    schema: {
        isValid: boolean,
    },
    isTouched: boolean,
    setInitialModel: Object => void,
    clearForm: () => void,
    model: Object,
}

@withValidation({
    validateOn: 'change',
    schema: {
        firstname: {
            // Custom validation + message
            customvalidator: {
                test: val => (val && val.length),
                message: 'Shit is niet goed man',
            },
            // Default validation + condition
            minLength: 2,
            maxLength: 20,
        },
        lastname: {
            // Validation without condition
            required: true,
        },
        phone: {
            required: true,
            phoneNumbers: true,
        },
    },
    messages: {
        required: 'I am mandatory',
        minLength: condition => `This field should contain a minimum of ${condition} characters.`,
    },
})
class MyForm extends React.Component {
    static props: Props;

    componentWillMount() {
        this.props.setInitialModel({
            firstname: 'Foo',
            lastname: 'Bar',
            phone: '0123456789',
        });
    }

    @autobind
    onSubmit(e: Event) {
        e.preventDefault();
        // submit
        const model = this.props.model;

        console.log(model.firstname.value);
        console.log(model.lastname.value);
        console.log(model.phone.value);
    }

    @autobind
    clearForm() {
        this.props.clearForm();
    }

    render() {
        return (
            <Validator.Form
                onSubmit={this.onSubmit}
            >
                <Validator name="firstname">
                    <label htmlFor="myform-firstname">First name</label>
                    <input id="myform-firstname" className="form-control" />
                </Validator>
                <Validator name="lastname">
                    <label htmlFor="myform-lastname">Last name</label>
                    <input id="myform-lastname" className="form-control" />
                </Validator>
                <Validator name="phone">
                    <label htmlFor="myform-phone">Phone number</label>
                    <input id="myform-phone" className="form-control" />
                </Validator>
                <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={this.clearForm}
                >
                    Clear
                </button>
                <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={!this.props.schema.isValid || !this.props.isTouched}
                >
                    Submit
                </button>
            </Validator.Form>
        );
    }
}

export default MyForm;
