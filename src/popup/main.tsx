import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './popup.css';

// Ouverte en grand dans un onglet, la popup prend une mise en page plus large.
document.documentElement.classList.toggle('page', new URLSearchParams(location.search).has('page'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
