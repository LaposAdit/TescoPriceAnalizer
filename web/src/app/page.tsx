"use client"
import Image from "next/image";
import { Button } from "flowbite-react";
import { useUser } from '@clerk/clerk-react';



export default function Home() {
  const { user } = useUser();


  if (user) {
    console.log(user.id); // This will log the user's ID
  }

  return (
    <>
      <div className="">
        <h1>{user?.id}</h1>
      </div>
    </>
  );
}
