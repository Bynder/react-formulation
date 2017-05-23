// @flow
import React from 'react';
import autobind from 'autobind-decorator';

import { withValidation, Validator } from '../../lib/react-formulation';

type Props = {
    setInitialModel: Object => void,
    clearForm: () => void,
    model: Object,
    isButtonDisabled: boolean,
}

@withValidation({
    validateOn: 'change',
    schema: {
        firstname: {
            required: true,
            minLength: 2,
        },
        lastname: {
            required: true,
        },
        confirmLastname: {
            required: true,
            isEqualTo: {
                dependsOn: 'lastname',
                test: (val1, val2) => (val1 === val2),
                message: 'this is not equal to lastname',
            },
        },
        phone: {
            phoneNumbers: true,
        },
    },
})
class MyForm extends React.Component {
    static props: Props;

    componentWillMount() {
        this.props.setInitialModel({
            firstname: 'Foo',
            lastname: 'Bar',
            confirmLastname: '',
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
        console.log(model.confirmLastname.value);
        console.log(model.phone.value);
    }

    @autobind
    clearForm() {
        this.props.clearForm();
    }

    render() {
        return (
            <Validator.Form onSubmit={this.onSubmit}>
                <Validator name="firstname">
                    <label htmlFor="myform-firstname">First name</label>
                    <input id="myform-firstname" className="form-control" autoComplete="off" />
                </Validator>
                <Validator name="lastname">
                    <label htmlFor="myform-lastname">Last name</label>
                    <input id="myform-lastname" className="form-control" autoComplete="off" />
                </Validator>
                <Validator name="confirmLastname">
                    <label htmlFor="myform-confirmLastname">Confirm last name</label>
                    <input id="myform-confirmLastname" className="form-control" autoComplete="off" />
                </Validator>
                <Validator name="phone">
                    <label htmlFor="myform-phone">Phone number</label>
                    <input id="myform-phone" className="form-control" autoComplete="off" />
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
                    disabled={this.props.isButtonDisabled}
                >
                    Submit
                </button>
            </Validator.Form>
        );
    }
}

export default MyForm;
