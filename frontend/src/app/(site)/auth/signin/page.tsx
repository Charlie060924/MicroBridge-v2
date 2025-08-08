import Signin from "@/components/auth/existing/Signin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Page - Solid SaaS Boilerplate",

  // other metadata
  description: "This is Login page for Startup Pro"
};

const SigninPage = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default SigninPage;
