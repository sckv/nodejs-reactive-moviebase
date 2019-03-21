import React from 'react';
import ReactDOM from 'react-dom';
import {App} from '@src/App';
import {env} from '@src/global/env';

const renderer = env === 'production' ? ReactDOM.hydrate : ReactDOM.render;

renderer(<App />, document.getElementById('app'));
