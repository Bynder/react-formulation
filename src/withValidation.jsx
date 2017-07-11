// @flow
import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import getComponentName from './utils/getComponentName';
import {
    getValidationErrors,
    getAllValidationErrors,
} from './utils/validateSchema';

export default function withValidation(configuration: Object | ReactClass<any>) {
    const Validation = function Validation(WrappedComponent: ReactClass<any>) {
        class ValidationWrapper extends React.Component {
            constructor(props: Props) {
                super(props);
                this.schema = {};
                if (configuration && configuration.schema) {
                    this.schema = configuration.schema;
                } else {
                    this.schema = {
                        [props.name]: props.rules,
                    };
                }

                let validateOn = 'blur';
                if (configuration && configuration.validateOn) {
                    validateOn = configuration.validateOn;
                } else if (props.validateOn) {
                    validateOn = props.validateOn;
                }

                let customMessages;
                if (configuration && configuration.messages) {
                    customMessages = configuration.messages;
                } else if (props.messages) {
                    customMessages = props.messages;
                }

                const initialModel = props.initialModel || {};
                if (!props.initialModel) {
                    Object.keys(this.schema).forEach((key) => {
                        initialModel[key] = {
                            value: null,
                            isTouched: false,
                        };
                    });
                }
                this.state = {
                    model: initialModel || {},
                    isTouched: false,
                    schema: getAllValidationErrors(this.schema, initialModel),
                    initialModel,
                    validateOn,
                    customMessages,
                    isButtonDisabled: true,
                };
            }

            getChildContext() {
                return {
                    validatorBindInput: this.bindInput,
                    validatorAttributes: this.getSchema,
                    validatorCanSubmit: this.state.schema.isValid && this.state.isTouched,
                    validatorMessages: this.state.customMessages,
                    validatorGetAllErrors: this.getAllValidationErrors,
                    validateOn: this.state.validateOn,
                };
            }

            componentWillUpdate(nextProps: Props, nextState: Object) {
                if (this.state.model !== nextState.model) {
                    const model = nextState.model;
                    const schema = getAllValidationErrors(this.schema, model);
                    // disable the button if there are no changes
                    const isChanged = Object.keys(model).some(key => (
                        model[key].value !== this.state.initialModel[key].value
                    ));
                    const isButtonDisabled = (isChanged) ? !schema.isValid || !nextState.isTouched : true;
                    this.setState({
                        isButtonDisabled,
                    });
                }
            }

            @autobind
            setInitialModel(model: Object) {
                const initialModel = this.state.model;
                Object.entries(model).forEach(([key, value]) => {
                    initialModel[key] = {
                        value,
                        isTouched: false,
                    };
                });
                this.setState({ model: initialModel, initialModel });
                this.resetValidation(initialModel);
            }

            @autobind
            setModel(model: Object) {
                this.setState({ model });
                return model;
            }

            @autobind
            setProperty(prop: string, value: any) {
                const newModel = this.setModel({
                    ...this.state.model,
                    [prop]: {
                        ...this.state.model[prop],
                        value,
                    },
                });
                this.getAllValidationErrors(newModel);
                return newModel;
            }

            @autobind
            setInputProperty(prop: string, value: any) {
                return this.setModel({
                    ...this.state.model,
                    [prop]: {
                        ...this.state.model[prop],
                        value,
                        isTouched: true,
                    },
                });
            }

            @autobind
            setTouched() {
                this.setState({ isTouched: true });
            }

            @autobind
            setUntouched() {
                this.setState({ isTouched: false });
            }

            @autobind
            getAllValidationErrors(initialModel: Object) {
                const model = initialModel || this.state.model;
                const schema = getAllValidationErrors(this.schema, model);
                this.setState({
                    schema,
                });
                return schema;
            }

            @autobind
            getSchema(name: string) {
                return this.state.schema.fields[name];
            }

            @autobind
            validateInput(e: Event) {
                const { name, type, value: targetValue } = e.target;
                const value = (type === 'checkbox') ? e.target.checked : targetValue;
                this.setState({
                    schema: getValidationErrors(
                        this.schema,
                        name,
                        value,
                        this.state.schema,
                        this.state.model,
                    ),
                });
            }

            @autobind
            validateField(name: string) {
                const value = this.state.model[name].value;
                this.setState({
                    schema: getValidationErrors(
                        this.schema,
                        name,
                        value,
                        this.state.schema,
                        this.state.model,
                    ),
                });
            }

            @autobind
            bindToChangeEvent(e: Event) {
                const { name, type, value } = e.target;

                if (type === 'checkbox') {
                    this.setInputProperty(name, e.target.checked);
                } else {
                    this.setInputProperty(name, value);
                }

                if (this.state.validateOn === 'change') {
                    this.validateInput(e);
                } else if (this.state.validateOn === 'submit' && this.state.schema.fields[name].isValid !== null) {
                    this.resetValidation();
                } else if (this.state.validateOn === 'blur' && this.state.schema.fields[name].isValid !== null) {
                    this.state.schema.fields[name].isValid = null;
                }

                if (!this.state.isTouched) {
                    this.setState({ isTouched: true });
                }
            }

            @autobind
            bindInput(name: string, type: string) {
                const model = this.state.model[name];
                const props = {
                    name,
                    onChange: this.bindToChangeEvent,
                    onBlur: this.state.validateOn === 'blur' ? this.validateInput : null,
                };
                if (type === 'checkbox') {
                    return {
                        ...props,
                        checked: (model && model.value) ? model.value : false,
                    };
                }
                return {
                    ...props,
                    value: (model && model.value) ? model.value : '',
                };
            }

            @autobind
            resetValidation() {
                const fields = {};

                Object.entries(this.state.schema.fields).forEach(([name, attributes]) => {
                    fields[name] = {
                        ...attributes,
                        isTouched: false,
                        isValid: null,
                        errors: [],
                    };
                });

                this.setState({
                    schema: {
                        isValid: null,
                        fields,
                    },
                    isButtonDisabled: true,
                });
            }

            @autobind
            resetForm() {
                this.resetValidation();
                this.setState({
                    model: this.state.initialModel,
                    isButtonDisabled: true,
                });
            }

            @autobind
            clearForm() {
                const model = {};

                Object.entries(this.state.model).forEach(([name, attributes]) => {
                    model[name] = {
                        ...attributes,
                        value: '',
                        isTouched: '',
                    };
                });

                this.resetValidation();
                this.setState({
                    model,
                    isTouched: false,
                });
            }

            render() {
                const nextProps = {
                    ...this.props,
                    bindInput: this.bindInput,
                    bindToChangeEvent: this.bindToChangeEvent,
                    model: this.state.model,
                    setProperty: this.setProperty,
                    setModel: this.setModel,
                    setInitialModel: this.setInitialModel,
                    isTouched: this.state.isTouched,
                    schema: this.state.schema,
                    validateForm: this.getAllValidationErrors,
                    validateField: this.validateField,
                    resetValidation: this.resetValidation,
                    resetForm: this.resetForm,
                    clearForm: this.clearForm,
                    getSchema: this.getSchema,
                    isButtonDisabled: this.state.isButtonDisabled,
                    setTouched: this.setTouched,
                    setUntouched: this.setUntouched,
                };
                return (
                    <WrappedComponent
                        {...nextProps}
                    />
                );
            }
        }

        ValidationWrapper.childContextTypes = {
            validatorBindInput: PropTypes.func,
            validatorAttributes: PropTypes.func,
            validatorCanSubmit: PropTypes.bool,
            validatorMessages: PropTypes.object,
            validatorGetAllErrors: PropTypes.func,
            validateOn: PropTypes.string,
        };

        ValidationWrapper.displayName = `Validator(${getComponentName(WrappedComponent)})`;

        return ValidationWrapper;
    };

    if (typeof configuration === 'object') {
        return Validation;
    }

    return Validation(configuration);
}
