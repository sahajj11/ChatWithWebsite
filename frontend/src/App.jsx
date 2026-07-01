import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ChatPage from './pages/ChatPage'
import UrlInput from './pages/UrlInput'

function App() {
  const [siteUrl, setSiteUrl] = useState(null);

  return (
    <>
      {!siteUrl ? (
        <UrlInput onSiteReady={setSiteUrl} />
      ) : (
        <ChatPage siteUrl={siteUrl} />
      )}
    </>
  )
}

export default App
