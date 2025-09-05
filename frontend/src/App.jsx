import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Chat from './components/Chat';
import ContactForm from './components/ContactForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/form" element={<ContactForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;