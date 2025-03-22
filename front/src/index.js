import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Завантаження env.js перед рендером додатку
const loadEnv = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/env.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

loadEnv().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );

  // Optional: запуск вимірювання продуктивності
  reportWebVitals();

}).catch((err) => {
  console.error('Failed to load env.js', err);
});
