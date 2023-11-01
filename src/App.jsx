import { useState, lazy, Suspense, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Main = lazy(() => import("./pages/Main"));
const Login = lazy(() => import("./pages/Login"));
const Exam = lazy(() => import("./pages/Exam"));
const Instructions = lazy(() => import("./pages/Instructions"));
const Submission = lazy(() => import("./pages/Submission"));
const Admin = lazy(() => import("./pages/Admin"));
const Configure = lazy(() => import("./pages/Configure"));

export const UserContext = createContext(null);

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState();

  return (
    <UserContext.Provider value={{ user: user, setUser: setUser }}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/submission" Component={Submission} />
            <Route path="/exam/:id" Component={Exam} />
            <Route path="/configure/:id" Component={Configure} />
            <Route path="/instructions/:id" Component={Instructions} />
            <Route path="/login" Component={Login} />
            <Route path="/admin" Component={Admin} />
            <Route path="/" Component={Main} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
