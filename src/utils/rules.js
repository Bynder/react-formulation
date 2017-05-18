const regExp = {
    phoneNumbers: /^(?:[0-9\s\-\+\(\)])+$/, // eslint-disable-line no-useless-escape
    noOnlySpaces: /^\s*$/, // https://regex101.com/r/j4DA51/2/
    email: /^[^@]+@[^@]+.[^@]+$/g, // https://regex101.com/r/dGDGRn/1/tests
};

const validationRules = {
    required: val => (val && val.trim().length),
    minLength: (val, minLength) => ((val && val.length > 0) ? val.length > minLength - 1 : true),
    maxLength: (val, maxLength) => ((val && val.length > 0) ? val.length <= maxLength : true),
    phoneNumbers: val => ((val && val.length > 0) ? regExp.phoneNumbers.test(val) : true),
    email: val => ((val && val.length > 0) ? regExp.email.test(val) : true),
    noOnlySpaces: val => ((val && val.length > 0) ? !regExp.noOnlySpaces.test(val) : true),
};

// @TODO: Create posibility for custom validation rules
// @TODO: Add doc bloc
const validateRules = (rule: string, value: any, condition?: any) => {
    let validatedRule = true;

    if (condition && typeof condition === 'object' && !condition.test(value)) {
        validatedRule = condition.message;
    } else if (validationRules[rule]) {
        validatedRule = !!validationRules[rule](value, condition);
    }

    return validatedRule;
};

export default validateRules;
