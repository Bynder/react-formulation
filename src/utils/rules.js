const regExp = {
    phoneNumbers: /^(?:[0-9\s\-\+\(\)])+$/, // eslint-disable-line no-useless-escape
    noOnlySpaces: /^\s*$/, // https://regex101.com/r/j4DA51/2/
    // https://regex101.com/r/A28vja/5/tests
    // eslint-disable-next-line max-len
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
const validateRules = (rule: string, value: any, condition?: any, models: Object) => {
    let validatedRule = true;
    if (condition && typeof condition === 'object') {
        const dependsOn = condition.dependsOn;
        if (dependsOn && models[dependsOn] && !condition.test(value, models[dependsOn].value)) {
            validatedRule = condition.message;
        } else if (!dependsOn && !condition.test(value)) {
            validatedRule = condition.message;
        }
    } else if (validationRules[rule]) {
        validatedRule = !!validationRules[rule](value, condition);
    }
    return validatedRule;
};

export default validateRules;
