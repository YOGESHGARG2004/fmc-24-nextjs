"use client";

import React, { use, useEffect, useState } from "react";

// Import the background image
import backgroundImage from "../components/bg.jpeg";
// Import the logo image
import logoImage from "../components/logo.png";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import NavBar from "../components/NavBar";
// import { useRouter } from "next/router";

function Login() {
  const [authData, setAuthData] = useState(null);
  const clientid = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
  const cookies = useCookies();
  const router = useRouter();
  // console.log(clientid);

  const handleLogin = async (user) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      }
    ).then((res) => res.json());
    // console.log(res);
    if (res.newUser) {
      router.push(`/register?authToken=${res.authToken}`);
    } else {
      cookies.set("authToken", res.authToken);
      router.push("/dashboard");
    }
  };

  return (
    <>
      <NavBar />
      <div
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Logo at the very top */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 mt-4">
          <img src={logoImage.src} alt="Logo" className="h-16" />
        </div>

        {/* Semi-transparent card containing both "Login" header and Google Sign-In button */}
        <div
          className="relative z-10 flex flex-col items-center bg-black bg-opacity-50 p-8 rounded-lg text-center"
          style={{ marginTop: "-50px" }}
        >
          <h2 className="text-4xl font-bold text-white mb-12">Login</h2>
          {/* Google login button */}
          <div className="w-full flex items-center justify-center">
            <GoogleOAuthProvider clientId={clientid}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  let decode = jwtDecode(credentialResponse.credential);
                  // console.log(decode);
                  let user = {
                    email: decode.email,
                  };
                  handleLogin(user);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
