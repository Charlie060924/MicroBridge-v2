import React from "react";
import Contact from "@/components/marketing/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Page - Solid SaaS Boilerplate",

  // other metadata
  description: "This is Support page for Solid Pro"
};

const SupportPage = () => {
  return (
    <div className="pb-20 pt-40">
      <Contact />
    </div>
  );
};

export default SupportPage;
