const defaultMessages = {
    required: () => 'This field is required.',
    minLength: condition => `This field has a minimum of ${condition} characters.`,
    maxLength: condition => `This field has a maximum of ${condition} characters.`,
    phoneNumbers: () => 'This is not a valid phone number.',
    email: () => 'This is not a valid email address.',
};

export default defaultMessages;

