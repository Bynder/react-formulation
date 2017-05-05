import { defineMessages } from 'react-intl';

const translations = defineMessages({
    ValidationRequired: {
        id: 'Validation.Required',
        defaultMessage: 'This field is required.',
    },
    ValidationMinLength: {
        id: 'Validation.MinLength',
        defaultMessage: 'This field has a minimum of {condition} characters.',
    },
    ValidationMaxLength: {
        id: 'Validation.MaxLength',
        defaultMessage: 'This field has a maximum of {condition} characters.',
    },
    ValidationPhoneNumbers: {
        id: 'Validation.PhoneNumbers',
        defaultMessage: 'The entered phone number is not valid',
    },
    ValidationNoOnlySpaces: {
        id: 'Validation.NoOnlySpaces',
        defaultMessage: 'You can not put only spaces.',
    },
    ValidationEmail: {
        id: 'Validation.Email',
        defaultMessage: 'The entered email is not valid',
    },
    ValidationUserCredentialsError: {
        id: 'Validation.UserCredentialsError',
        defaultMessage: 'The current password is not valid',
    },
    ValidationPasswordStrength: {
        id: 'Validation.PasswordStrength',
        defaultMessage: 'The current password is not strongh enough',
    },
    ValidationIsEqualTo: {
        id: 'Validation.IsEqualTo',
        defaultMessage: '{field1} must be equal to {field2}',
    },
});

const messages = {
    required: translations.ValidationRequired,
    minLength: translations.ValidationMinLength,
    maxLength: translations.ValidationMaxLength,
    phoneNumbers: translations.ValidationPhoneNumbers,
    noOnlySpaces: translations.ValidationNoOnlySpaces,
    email: translations.ValidationEmail,
    userCredentialsError: translations.ValidationUserCredentialsError,
    passwordStrength: translations.ValidationPasswordStrength,
    isEqualTo: translations.ValidationIsEqualTo,
};

export default messages;

