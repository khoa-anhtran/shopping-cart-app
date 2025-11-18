import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@ant-design/v5-patch-for-react-19';
import App from './App'
import '@/styles/index.scss'
import { Provider } from 'react-redux'
import store from './store/store'
import { BrowserRouter } from 'react-router-dom'
import ThemeProvider from './providers/ThemeProvider';
import UserInfoProvider from './providers/UserInfoProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <UserInfoProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </UserInfoProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)