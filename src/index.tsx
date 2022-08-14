import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

import * as Thrscene from './three-scene/index';

function startReact(): void {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    //<React.StrictMode>
    <App />
    //</React.StrictMode>
  );
}

Thrscene.init({ ready: startReact });

reportWebVitals();
