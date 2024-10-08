"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  University,
} from "lucide-react";
import bg from "./bg.png";
import NavBar from "../components/NavBar";
import { useCookies } from "next-client-cookies";
import { getEventById } from "../../utils/events/events";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(null);
  const cookies = useCookies();

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        }
      ).then((res) => res.json());
      setUserData(res);
      setRegisteredEvents(res.registered.map((res)=>getEventById(res)))
    })();
    
  }, []);

  const BackgroundMaker = () => (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundRepeat: "repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundColor: "black",
      }}
    ></div>
  );

  const DisplayInfo = ({ icon, dataType, value }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-2 text-gray-300"
    >
      {icon}
      <span className="font-semibold">{dataType}:</span>
      <span>{value}</span>
    </motion.div>
  );

  const EventCard = ({ event }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className=" bg-slate-400 border border-white bg-opacity-30 p-4 rounded-lg shadow-lg"
    >
      <h3 className="text-xl font-bold text-white mb-2">{event.type}</h3>
      <p className="text-gray-300">{event.name}</p>
    </motion.div>
  );

  const Loader = () => (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-t-4 border-red-500 rounded-full"
      />
    </div>
  );

  return (
    <>
      <NavBar />
      <div className=" relative min-h-screen font-sans text-white">
        <BackgroundMaker />
        <div className="container backdrop-blur-md bg-gray-400/10 rounded-md mx-auto px-8 py-8">
          {userData ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-4xl font-bold mb-8">
                Welcome, {userData.name}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <DisplayInfo
                  icon={<User />}
                  dataType="Name"
                  value={userData.name}
                />
                <DisplayInfo
                  icon={<Mail />}
                  dataType="Email"
                  value={userData.email}
                />
                <DisplayInfo
                  icon={<Phone />}
                  dataType="Mobile"
                  value={userData.phone}
                />
                <DisplayInfo
                  icon={<Calendar />}
                  dataType="Age"
                  value={userData.age}
                />
              </div>
              {registeredEvents ? (
                <h2 className="text-2xl font-semibold mb-4">
                  Registered Events:
                </h2>
              ) : (
                <></>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents ?(registeredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))):<></>}
              </div>
            </motion.div>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
