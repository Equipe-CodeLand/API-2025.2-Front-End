import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login"); 
    }
  }, []);

  return (
    <>
      <div>
        <h1>Home</h1>
      </div>
    </>
  );
}
