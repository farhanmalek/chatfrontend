import React from "react";
import Login from "../components/login/Login";
import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";

const page = () => {
  return (
    <BackgroundGradientAnimation>
        <div className="flex flex-col items-center h-[100vh] justify-around md:flex-row">
      <div className="flex flex-col ">
        <p className="font-extrabold text-2xl md:text-5xl text-center">WilliamsBook</p>
        <p className="font-bold text-lg text-center">
          Connect. Anytime. Anywhere. Instantly.
        </p>
      </div>
      <div className=" flex flex-col gap-4">
        <p className="font-bold text-xl md:text-3xl text-center">Hello Again!</p>
        <Login />
      </div>
    </div>
    </BackgroundGradientAnimation>
  );
};

export default page;
