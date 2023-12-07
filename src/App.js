import './App.css';
import Home from './pages/home';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
    <Route path="/" element={ <Home  />} />
    {/* // <Route path="/clientForm" element={ <ClientForm />} /> */}
    {/* <Route path="/detailPage" element={ <DetailPage />} /> */}
      {/* <Features data={landingPageData.Features} />
      <About data={landingPageData.About} />
      <Services data={landingPageData.Services} />
      <Gallery data={landingPageData.Gallery} />
      <Testimonials data={landingPageData.Testimonials} />
      <Team data={landingPageData.Team} />
      <Contact data={landingPageData.Contact} /> */}
 </Routes>
    </div>
  );
}

export default App;
