import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import worldwarImage from "@/public/images/world-of-war-2020.png";
import gothicImage from "@/public/images/at-war-goghic-line.png";
import timetravelerImage from "@/public/images/time-time-travelers.png";
import doctorWhoImage from "@/public/images/doctor-who.png";
import slugfestImage from "@/public/images/slugfest.png";
import fatherhoodImage from "@/public/images/fatherhood.png";
import silentPatientImage from "@/public/images/the-silent-patient.png";

const HeroSection = () => {
  return (
    <section className="bg-[url(/images/Rectangle2.png)] bg-cover overflow-x-hidden">
      <div className="container py-4 px-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-[#3D2E7C] text-balance leading-tight">
              Find Your Book...
            </h1>
            <p className="text-lg text-[#6B5B95] leading-relaxed max-w-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu
              feugiat amet, libero ipsum enim pharetra hac. Urna commodo, lacus
              ut magna velit eleifend. Amet, quis urna, a eu.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-[#3D2E7C] text-[#3D2E7C] hover:bg-[#3D2E7C] hover:text-white mt-2 bg-transparent"
            >
              READ MORE →
            </Button>
            <div className="flex gap-3 pt-4">
              <div className="w-3 h-3 rounded-full bg-[#E85D4A]"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
          </div>
          <div className="relative h-[500px] lg:h-[600px]">
            <div className="absolute top-[20%] left-[10%] w-[180px] h-[260px] shadow-xl z-10">
              <Image
                src={worldwarImage}
                alt="2020 World of War"
                className="w-full h-full object-cover rounded-lg "
                layout="fill"
              />
            </div>
            <div className="absolute top-[5%] right-[33%] w-[180px] h-[260px]  shadow-xl z-20">
              <Image
                src={gothicImage}
                alt="At War on the Gothic Line"
                className="w-full h-full object-cover rounded-lg"
                layout="fill"
              />
            </div>
            <div className="absolute bottom-[6%] right-[33%] w-[180px] h-[260px] shadow-xl z-15">
              <Image
                src={timetravelerImage}
                alt="The Time Travelers Handbook"
                className="w-full h-full object-cover rounded-lg"
                layout="fill"
              />
            </div>
            <div className="absolute top-[10%] right-[3%] w-[180px] h-[260px]  shadow-xl z-25">
              <Image
                src={doctorWhoImage}
                alt="Doctor Who"
                className="w-full h-full object-cover rounded-lg"
                layout="fill"
              />
            </div>
            <div className="absolute bottom-[1%] right-[3%] w-[180px] h-[260px]  shadow-xl z-18">
              <Image
                src={slugfestImage}
                alt="Slugfest"
                className="w-full h-full object-cover rounded-lg"
                layout="fill"
              />
            </div>
            <div className="absolute top-[5%] right-[-16%] w-[100px] h-[260px] shadow-lg z-5 opacity-90">
              <Image
                src={fatherhoodImage}
                alt="Fatherhood"
                className="w-full h-full object-cover rounded-l-lg"
                layout="fill"
              />
            </div>
            <div className="absolute bottom-[6%] right-[-16%] w-[100px] h-[260px]  shadow-lg z-5 opacity-90">
              <Image
                src={silentPatientImage}
                alt="The Silent Patient"
                className="w-full h-full object-cover rounded-lg"
                layout="fill"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
