import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Main = lazy(() => import("./pages/Main"));
const Login = lazy(() => import("./pages/Login"));
const Exam = lazy(() => import("./pages/Exam"));
const Instructions = lazy(() => import("./pages/Instructions"));
const Submission = lazy(() => import("./pages/Submission"));

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/submission" Component={Submission} />
          <Route path="/exam" Component={Exam} />
          <Route path="/instructions" Component={Instructions} />
          <Route path="/login" Component={Login} />
          <Route path="/" Component={Main} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
