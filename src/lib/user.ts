// "use client";

// import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const getUserId = () => {
  //   const [userId, setUserId] = useState<string | null>(null);

  //   useEffect(() => {
  //   let storedUserId = localStorage.getItem("userId");
  //   if (!storedUserId) {
  const storedUserId = uuidv4();

  return storedUserId;
};
