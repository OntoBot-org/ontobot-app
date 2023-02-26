import { Route, Routes } from 'react-router-dom';

import { Home, TryOntoBot, Vocabulary } from './pages'
import { Footer, Navbar } from './components';
import './index.css'

function App() {
  return (
    <>
      <div className='mx-10'>
        <Navbar />

        <div>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/try-ontobot' element={<TryOntoBot />} />
            <Route path='/vocabulary' element={<Vocabulary />} />
          </Routes>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export default App;
