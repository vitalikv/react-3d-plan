import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.scss';

import * as Thrscene from './three-scene/index';

export function initReact(): void {}

Thrscene.init({ ready: initReact });
