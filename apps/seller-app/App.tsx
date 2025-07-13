import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SellerDashboard from './pages/index';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SellerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;