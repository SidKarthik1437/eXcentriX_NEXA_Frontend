import React, { useEffect } from "react";
import { useNavigate, redirect } from "react-router-dom";
function Main() {
  const navigate = useNavigate();

  useEffect(() => { 
    navigate("/login", {
      replace: true,
    });
  });
  return <div>Main</div>;
}

export default Main;
