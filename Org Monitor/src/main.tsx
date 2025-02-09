import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Homepage from "./page/Homepage.tsx";
import Authpage from "./page/Authpage.tsx";
import NotfoundPage from "./page/NotfoundPage.tsx";
import ReposPage from "./page/ReposPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Profilepage from "./page/Profilepage.tsx";
import GlobalProvider from "./context/globalContext.tsx";

createRoot(document.getElementById("root")!).render(
  <GlobalProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Homepage />} />
          <Route path="auth" element={<Authpage />} />
          <Route
            path="profile"
            element={<ProtectedRoute element={<Profilepage />} />}
          />
          <Route path="repos" element={<ReposPage />} />
          <Route path="*" element={<NotfoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </GlobalProvider>
);
