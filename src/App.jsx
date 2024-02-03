import { useState, lazy, Suspense, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Main = lazy(() => import("./pages/Main"));
const Login = lazy(() => import("./pages/Login"));
const Exam = lazy(() => import("./pages/Exam"));
const Instructions = lazy(() => import("./pages/Instructions"));
const Submission = lazy(() => import("./pages/Submission"));
const Admin = lazy(() => import("./pages/Admin"));
const Configure = lazy(() => import("./pages/Configure"));

import useFetchData from "./hooks/useFetchData";
import { UserContext } from "./context/UserContext";
import { DataProvider } from "./context/DataContext";
import { ProtectedRoute } from "./hooks/ProtectedRoute";

function Routing() {
  useFetchData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/submission" element={<Submission />} />
        <Route path="/exam/:id" element={<Exam />} />
        <Route path="/configure/:examid" element={<Configure />} />
        <Route path="/instructions/:id" element={<Instructions />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute element={<Admin />} allowedRoles={["ADMIN"]} />
          }
        />
        <Route path="/" element={<Main />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user: user, setUser: setUser }}>
        <DataProvider>
          <Routing />
        </DataProvider>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
