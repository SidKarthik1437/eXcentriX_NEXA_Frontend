import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Login = lazy(() => import("./pages/Login"));
const Exam = lazy(() => import("./pages/Exam"));
const Instructions = lazy(() => import("./pages/Instructions"));

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/exam" Component={Exam} />
          <Route path="/instructions" Component={Instructions} />
          <Route path="/" Component={Login} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
