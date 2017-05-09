// @flow
import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import getComponentName from './utils/getComponentName';
import {
    setSchema,
    getValidationErrors,
    getAllValidationErrors,
} from './utils/validateSchema';

export default function withValidation(configuration: Object) {
    return function Validation(WrappedComponent: ReactClass<any>) {
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

                this.state = {
                    model: props.initialModel || {},
                    isTouched: false,
                    schema: setSchema(this.schema),
                    validateOn,
                    customMessages,
                };
            }

            getChildContext() {
                return {
                    validatorBindInput: this.bindInput,
                    validatorAttributes: this.getSchema,
                    validatorCanSubmit: this.state.schema.isValid && this.state.isTouched,
                    validatorMessages: this.state.customMessages,
                };
            }

            @autobind
            setInitialModel(model: Object) {
                const initialModel = {};

                Object.entries(model).forEach(([key, value]) => {
                    initialModel[key] = {
                        value,
                        isTouched: false,
                    };
                });
                this.setState({ model: initialModel, initialModel });
                this.getAllValidationErrors(initialModel);
            }

            @autobind
            setModel(model: Object) {
                this.setState({ model });
                return model;
            }

            @autobind
            setProperty(prop: string, value: any) {
                return this.setModel({
                    ...this.state.model,
                    [prop]: {
                        ...this.state.model[prop],
                        value,
                    },
                });
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
            getAllValidationErrors(initialModel: Object) {
                const model = initialModel || this.state.model;
                this.setState({
                    schema: getAllValidationErrors(this.schema, model),
                });
            }

            @autobind
            getSchema(name: string) {
                return this.state.schema.fields[name];
            }

            @autobind
            validateInput(e: Event) {
                const { name, value } = e.target;

                this.setState({
                    schema: getValidationErrors(
                        this.schema,
                        name,
                        value,
                        this.state.schema,
                    ),
                });
            }

            @autobind
            bindToChangeEvent(e: Event) {
                const { name, value } = e.target;

                this.setInputProperty(name, value);

                if (this.state.validateOn === 'change') {
                    this.validateInput(e);
                }

                if (!this.state.isTouched) {
                    this.setState({ isTouched: true });
                }
            }

            @autobind
            bindInput(name: string) {
                const model = this.state.model[name];
                return {
                    name,
                    value: (model && model.value) ? model.value : '',
                    onChange: this.bindToChangeEvent,
                    onBlur: this.state.validateOn === 'blur' ? this.validateInput : null,
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
                });
            }

            @autobind
            resetForm() {
                this.resetValidation();
                this.setState({
                    model: this.state.initialModel,
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
                    resetValidation: this.resetValidation,
                    resetForm: this.resetForm,
                    clearForm: this.clearForm,
                    getSchema: this.getSchema,
                    isButtonDisabled: this.state.schema.isValid && this.state.isTouched,
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
        };

        ValidationWrapper.displayName = `Validator(${getComponentName(WrappedComponent)})`;

        return ValidationWrapper;
    };
}
