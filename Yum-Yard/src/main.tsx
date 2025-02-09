import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import GlobalProvider from "./context/globalContext.tsx";
import RecipesPage from "./pages/RecipesPage.tsx";
import App from "./App.tsx";
import AuthenticationPage from "./pages/AuthenticationPage.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <GlobalProvider>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="auth" element={<AuthenticationPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </GlobalProvider>
  </BrowserRouter>
);
