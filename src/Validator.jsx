import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import messages from './utils/validationMessages';

const ValidatorForm = ({ onSubmit, children, ...props }, context) => {
    let onFormSubmit = onSubmit;
    if (!context.validatorCanSubmit) {
        onFormSubmit = (e) => {
            e.preventDefault();
        };
    }

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
};

const Validator = ({
    name,
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
            {(schema.isValid === false && schema.isTouched) ? (
                <ValidatorErrorsBlock
                    errors={schema.errors}
                />
            ) : null }
        </div>
    );
};

Validator.propTypes = {
    name: PropTypes.string,
    children: PropTypes.node,
};

Validator.contextTypes = {
    validatorBindInput: PropTypes.func,
    validatorAttributes: PropTypes.func,
};

const ErrorsBlock = ({
    errors,
    intl,
}) => (
    errors ? (
        <div>
            {errors.map((error, index) => {
                let displayError = null;
                if (messages[error.rule]) {
                    displayError = intl.formatMessage(messages[error.rule], {
                        condition: error.condition,
                    });
                } else {
                    displayError = intl.formatMessage(error);
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

const ValidatorErrorsBlock = injectIntl(ErrorsBlock);

ErrorsBlock.propTypes = {
    errors: PropTypes.arrayOf(PropTypes.object),
    intl: PropTypes.objectOf(PropTypes.any),
};

Validator.Form = ValidatorForm;
Validator.Errors = ValidatorErrorsBlock;

Object.defineProperty(Validator.Errors, 'name', { value: 'Validator.Errors' });
Object.defineProperty(Validator.Form, 'name', { value: 'Validator.Form' });

export default Validator;
