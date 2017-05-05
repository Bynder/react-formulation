import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';

import MyForm from './MyForm.jsx';

ReactDOM.render(
    <IntlProvider locale="en">
        <MyForm />
    </IntlProvider>
, window.root); // eslint-disable-line
