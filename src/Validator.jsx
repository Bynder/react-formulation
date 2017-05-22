import React from 'react';
import PropTypes from 'prop-types';

import defaultMessages from './utils/validationMessages';

const ValidatorForm = ({ onSubmit, children, ...props }, context) => {
    const onFormSubmit = (e) => {
        const validatedFields = context.validatorGetAllErrors();
        e.preventDefault();

        if ((context.validateOn !== 'submit' && context.validatorCanSubmit) ||
                (context.validateOn === 'submit' && validatedFields.isValid)) {
            onSubmit(e);
        }
    };

    return (
        <form
            onSubmit={onFormSubmit}
            {...props}
        >
            {children}
        </form>
    );
};

ValidatorForm.propTypes = {
    onSubmit: PropTypes.func,
    children: PropTypes.node,
};

ValidatorForm.contextTypes = {
    validatorCanSubmit: PropTypes.bool,
    validatorGetAllErrors: PropTypes.func,
    validateOn: PropTypes.string,
};

const Validator = ({
    name,
    hideErrors,
    children,
}, context) => {
    const schema = context.validatorAttributes(name);

    return (
        <div>
            {React.Children.map(children,
                (child) => {
                    if (typeof child === 'object') {
                        return React.cloneElement(child, {
                            ...context.validatorBindInput(name),
                        });
                    }
                    return null;
                },
            )}
            {(!hideErrors && schema.isValid === false && (schema.isTouched || context.validateOn === 'submit')) ? (
                <ErrorsBlock
                    errors={schema.errors}
                />
            ) : null }
        </div>
    );
};

Validator.propTypes = {
    name: PropTypes.string,
    hideErrors: PropTypes.bool,
    children: PropTypes.node,
};

Validator.contextTypes = {
    validatorBindInput: PropTypes.func,
    validatorAttributes: PropTypes.func,
    validateOn: PropTypes.string,
};

const ErrorsBlock = ({
    errors,
}, context) => (
    errors ? (
        <div>
            {errors.map((error, index) => {
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
                return (
                    <div key={index}>
                        {displayError}
                    </div>
                );
            })}
        </div>
    ) : null
);

ErrorsBlock.propTypes = {
    errors: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string,
        ]),
    ),
};

ErrorsBlock.contextTypes = {
    validatorMessages: PropTypes.object,
};

Validator.Form = ValidatorForm;
Validator.Errors = ErrorsBlock;

Object.defineProperty(Validator.Errors, 'name', { value: 'Validator.Errors' });
Object.defineProperty(Validator.Form, 'name', { value: 'Validator.Form' });

export default Validator;
