"use client";

import { usePageVisibility } from "../hooks/getVisState";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import screenfull from "screenfull";

export default function Submission() {
  const visibilityState = usePageVisibility();

  const navigate = useNavigate();

  return (
    <main className="flex relative h-screen w-full flex-col bg-white text-black ">
      <div>
        <div className="px-4 py-2 text-4xl font-bold tracking-wider border-b-2">
          Submitted
        </div>
        <div></div>
        <div className="flex justify-end p-2 border-t-2 gap-x-2">
          Your answers have been submitted!
        </div>
      </div>
    </main>
  );
}
