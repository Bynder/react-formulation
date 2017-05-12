// @flow
import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import type { Children } from 'react';

import withValidation from './withValidation';

import defaultMessages from './utils/validationMessages';

type Props = {
    name: string,
    setInitialModel: () => void,
    initialValue: string,
    children: Children,
    bindInput: () => void,
    getSchema: () => void,
    isButtonDisabled: () => void,
    onSubmit: () => void,
    model: Object,
    resetForm: () => void,
};

const defaultStyle = {
    display: 'inline',
};

class InlineFormValidator extends React.Component {
    static props: Props;

    getChildContext() {
        return {
            validatorName: this.props.name,
            validatorBindInput: this.props.bindInput,
            validatorAttributes: this.props.getSchema,
            validatorCanSubmit: !this.props.isButtonDisabled,
            validatorResetForm: this.props.resetForm,
        };
    }

    componentWillMount() {
        const { name, initialValue } = this.props;
        this.props.setInitialModel({
            [name]: initialValue,
        });
    }

    @autobind
    onSubmit(e: Event) {
        e.preventDefault();

        if (this.props.isButtonDisabled) {
            const submitValue = {};
            Object.entries(this.props.model).forEach(([model, attributes]) => {
                submitValue.name = model;
                submitValue.value = attributes.value;
            });
            this.props.onSubmit(submitValue);
        }
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.props.children}
            </form>
        );
    }
}

InlineFormValidator.childContextTypes = {
    validatorName: PropTypes.string,
    validatorBindInput: PropTypes.func,
    validatorAttributes: PropTypes.func,
    validatorCanSubmit: PropTypes.bool,
    validatorResetForm: PropTypes.func,
};


class InlineFormFieldInput extends React.Component { // eslint-disable-line react/no-multi-comp
    @autobind
    onKeyUp(e) {
        if (this.props.resetOnEscape && e.keyCode === 27) {
            this.context.validatorResetForm();
        }
        if (typeof this.props.child.props.onKeyUp === 'function') {
            this.props.child.props.onKeyUp(e);
        }
    }
    render() {
        return React.cloneElement(this.props.child, {
            ...this.context.validatorBindInput(this.context.validatorName),
            onKeyUp: this.onKeyUp,
        });
    }
}

InlineFormFieldInput.propTypes = {
    child: PropTypes.node,
    resetOnEscape: PropTypes.bool,
};

InlineFormFieldInput.contextTypes = {
    validatorName: PropTypes.string,
    validatorBindInput: PropTypes.func,
    validatorResetForm: PropTypes.func,
};

const InlineFormField = ({ resetOnEscape, children, ...props }) => (
    <div {...props}>
        {React.Children.map(children, (child, i) => (
            <InlineFormFieldInput key={i} child={child} resetOnEscape={resetOnEscape} />
        ))}
    </div>
);

InlineFormField.propTypes = {
    resetOnEscape: PropTypes.bool,
    children: PropTypes.node,
};

const InlineFormErrors = ({
    children,
    ...props
}, context) => {
    let errors = [];
    const schema = context.validatorAttributes(context.validatorName);

    if (schema.errors && schema.errors.length) {
        errors = schema.errors;
    }

    return (
        <div {...props}>
            {errors.map((error) => {
                let displayError = null;
                const messages = context.validatorMessages;

                if (typeof error === 'string') {
                    displayError = error;
                } else if (messages && messages[error.rule]) {
                    const customError = messages[error.rule];
                    if (typeof customError === 'function') {
                        displayError = customError(error.condition);
                    } else if (typeof customError === 'string') {
                        displayError = customError;
                    }
                } else if (defaultMessages[error.rule]) {
                    displayError = defaultMessages[error.rule](error.condition);
                } else {
                    displayError = error.rule;
                }

                return displayError;
            })}
        </div>
    );
};

InlineFormErrors.propTypes = {
    children: PropTypes.node,
};

InlineFormErrors.contextTypes = {
    validatorName: PropTypes.string,
    validatorAttributes: PropTypes.func,
    validatorMessages: PropTypes.object,
};

const InlineFormSubmit = ({
    style,
    children,
    ...props
}, context) => (
    <div style={style || defaultStyle} {...props}>
        {React.Children.map(children,
            (child) => {
                if (typeof child === 'object') {
                    return React.cloneElement(child, {
                        disabled: !context.validatorCanSubmit,
                    });
                }
                return null;
            },
        )}
    </div>
);

InlineFormSubmit.propTypes = {
    style: PropTypes.objectOf(
        PropTypes.string,
    ),
    children: PropTypes.node,
};

InlineFormSubmit.contextTypes = {
    validatorCanSubmit: PropTypes.bool,
};

const InlineFormCancel = ({
    style,
    children,
    ...props
}, context) => (
    <div style={style || defaultStyle} {...props}>
        {React.Children.map(children,
            (child) => {
                const onClick = () => {
                    context.validatorResetForm();
                    if (child.props.onClick) {
                        child.props.onClick();
                    }
                };

                return React.cloneElement(child, {
                    onClick,
                });
            },
        )}
    </div>
);

InlineFormCancel.propTypes = {
    style: PropTypes.objectOf(
        PropTypes.string,
    ),
    children: PropTypes.node,
};

InlineFormCancel.contextTypes = {
    validatorResetForm: PropTypes.func,
};

const InlineForm = withValidation({})(InlineFormValidator);

InlineForm.Field = InlineFormField;
InlineForm.Errors = InlineFormErrors;
InlineForm.Submit = InlineFormSubmit;
InlineForm.Cancel = InlineFormCancel;

Object.defineProperty(InlineForm.Field, 'name', { value: 'InlineForm.Field' });
Object.defineProperty(InlineForm.Errors, 'name', { value: 'InlineForm.Errors' });
Object.defineProperty(InlineForm.Submit, 'name', { value: 'InlineForm.Submit' });
Object.defineProperty(InlineForm.Cancel, 'name', { value: 'InlineForm.Cancel' });

export default InlineForm;
