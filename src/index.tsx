import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.scss';

import * as Thrscene from './three-scene/index';

export function initReact(): void {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(<div></div>);
}

Thrscene.init({ ready: initReact });
