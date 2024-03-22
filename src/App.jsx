import { useState, lazy, Suspense, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import useFetchData from "./hooks/useFetchData";
import { UserContext } from "./context/UserContext";
import { DataProvider } from "./context/DataContext";
import { ProtectedRoute } from "./hooks/ProtectedRoute";
import { lazyWithRetries } from "./hooks/lazyWithRetries";
import NotFound from "./pages/NotFound";
import UserAdmin from "./pages/UserAdmin";
import CreateUser from "./components/admin/user/CreateUser";

const Main = lazy(() => import("./pages/Main"));
const Login = lazy(() => import("./pages/Login"));
const Exam = lazy(() => import("./pages/Exam"));
const Instructions = lazy(() => import("./pages/Instructions"));
const Submission = lazy(() => import("./pages/Submission"));
const Admin = lazy(() => import("./pages/Admin"));
const Configure = lazy(() => import("./pages/Configure"));

function Routing() {
  useFetchData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/submission"
          element={
            <ProtectedRoute
              element={<Submission />}
              allowedRoles={["STUDENT"]}
            />
          }
        />
        <Route
          path="/exam/:id"
          element={
            <ProtectedRoute element={<Exam />} allowedRoles={["STUDENT"]} />
          }
        />
        <Route
          path="/configure/:examid"
          element={
            <ProtectedRoute element={<Configure />} allowedRoles={["ADMIN"]} />
          }
        />
        <Route
          path="/instructions/:id"
          element={
            <ProtectedRoute
              element={<Instructions />}
              allowedRoles={["STUDENT"]}
            />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route
          path="/userAdmin"
          element={
            <ProtectedRoute element={<UserAdmin />} allowedRoles={["ADMIN"]} />
          }
        />
        <Route
          path="/create-user"
          element={
            <ProtectedRoute element={<UserAdmin />} allowedRoles={["ADMIN"]} />
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute element={<Admin />} allowedRoles={["ADMIN"]} />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute
              element={<Main />}
              allowedRoles={["STUDENT", "ADMIN"]}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
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
