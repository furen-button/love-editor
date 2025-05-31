import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EditLoveData from './EditLoveData';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EditLoveData />
  </StrictMode>,
)
