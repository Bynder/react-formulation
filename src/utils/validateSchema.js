// @flow
import validateRules from './rules';

const getAllValidationErrors = (schema: Object, model: Object) => {
    const validationErrors = {
        fields: {},
    };

    if (!Object.keys(model).length) {
        return {
            fields: {},
            isValid: null,
        };
    }

    Object.entries(schema).forEach(([name, rules]) => {
        const errors = [];
        const isValid = (typeof validationErrors.isValid !== 'undefined') ?
            validationErrors.isValid :
            true;

        if (model[name] && rules) {
            const value = model[name].value;
            Object.entries(rules).forEach(([rule, condition]) => {
                const validatedRules = validateRules(rule, value, condition);
                if (!validatedRules) {
                    const validationError = {
                        rule,
                        condition,
                    };
                    errors.push(validationError);
                } else if (typeof validatedRules === 'object') {
                    errors.push(validatedRules);
                }
            });
        }

        validationErrors.fields[name] = {
            errors,
            isValid: !errors.length,
            isTouched: false,
        };
        validationErrors.isValid = isValid && !errors.length;
    });

    return validationErrors;
};

const getValidationErrors = (
    schema: Object,
    name: string,
    model: Object | string,
    validation: Object,
) => {
    const errors = [];
    const fields = validation.fields;
    const value = model.value ? model.value : model;
    const rules = schema[name];

    let isValid = true;
    if (Object.keys(validation.fields).length) {
        Object.entries(validation.fields).forEach(([field, attributes]) => {
            if (field !== name && attributes.isValid === false) {
                isValid = false;
            }
        });
    }

    const field = {
        isTouched: true,
        isValid: true,
        errors,
    };

    if (!rules) {
        fields[name] = field;

        return {
            isValid: isValid && !errors.length,
            fields,
        };
    }

    Object.entries(rules).forEach(([rule, condition]) => {
        const validatedRules = validateRules(rule, value, condition);
        if (!validatedRules) {
            const validationError = {
                rule,
                condition,
            };
            errors.push(validationError);
        } else if (typeof validatedRules === 'string') {
            errors.push(validatedRules);
        }
    });

    fields[name] = {
        ...field,
        isValid: !errors.length,
        errors,
    };

    return {
        isValid: isValid && !errors.length,
        fields,
    };
};

const setSchema = (validationSchema: Object) => {
    const schema = {
        isValid: null,
        fields: {},
    };

    Object.keys(validationSchema).forEach((key) => {
        schema.fields[key] = {
            isValid: null,
        };
    });

    return schema;
};

export {
    getAllValidationErrors,
    getValidationErrors,
    setSchema,
};
