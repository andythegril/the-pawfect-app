import './App.css'
import {Route, Routes} from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Layout from "./Layout.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import axios from "axios";
import {UserContextProvider} from "./UserContext.jsx";
import PetPage from "./pages/PetPage.jsx";
import PetFormPage from "./pages/PetFormPage.jsx";
import MatchingDashboardPage from "./pages/MatchingDashboardPage.jsx";
import AdoptionPetsPage from "./pages/AdoptionPetPage.jsx";


axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {

  return (
      <UserContextProvider>
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/account/pets" element={<PetPage />} />
            <Route path="/account/pets/new" element={<PetFormPage />} />
            <Route path="/account/pets/:id" element={<PetFormPage />} />
            <Route path="/account/matching" element={<MatchingDashboardPage />} />
            <Route path="/account/adoption" element={<AdoptionPetsPage />} />


          </Route>
        </Routes>
      </UserContextProvider>
  )
}

export default App
