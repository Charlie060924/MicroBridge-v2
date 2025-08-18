"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setIsError(true);
      setErrorMessage("Invalid verification link");
    }
  }, [token]);

  const verifyEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setIsVerified(true);
        toast.success("Email verified successfully!");
      } else {
        const error = await response.json();
        setIsError(true);
        setErrorMessage(error.error || "Failed to verify email");
        toast.error(error.error || "Failed to verify email");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setIsError(true);
      setErrorMessage("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    // This would typically require the user to enter their email
    // For now, we'll redirect to a resend page or show a message
    toast.info("Please use the resend verification feature from the sign-in page");
    router.push("/auth/signin");
  };

  if (isLoading) {
    return (
      <section className="pb-12.5 pt-32.5 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
        <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:to-[#252A42]"></div>
          <div className="absolute bottom-17.5 left-0 -z-1 h-1/3 w-full">
            <div className="relative h-20 w-full"></div>
          </div>

          <div className="rounded-lg bg-white px-7.5 pt-7.5 shadow-md dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15">
            <div className="text-center">
              <RefreshCw className="mx-auto h-16 w-16 text-green-500 mb-4 animate-spin" />
              <h2 className="mb-4 text-2xl font-semibold text-black dark:text-white">
                Verifying Your Email
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isVerified) {
    return (
      <section className="pb-12.5 pt-32.5 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
        <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:to-[#252A42]"></div>
          <div className="absolute bottom-17.5 left-0 -z-1 h-1/3 w-full">
            <div className="relative h-20 w-full"></div>
          </div>

          <div className="rounded-lg bg-white px-7.5 pt-7.5 shadow-md dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15">
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="mb-4 text-2xl font-semibold text-black dark:text-white">
                Email Verified Successfully
              </h2>
              <p className="mb-8 text-gray-600 dark:text-gray-400">
                Your email address has been verified. You can now access all features of your account.
              </p>
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="pb-12.5 pt-32.5 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
        <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:to-[#252A42]"></div>
          <div className="absolute bottom-17.5 left-0 -z-1 h-1/3 w-full">
            <div className="relative h-20 w-full"></div>
          </div>

          <div className="rounded-lg bg-white px-7.5 pt-7.5 shadow-md dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15">
            <div className="text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h2 className="mb-4 text-2xl font-semibold text-black dark:text-white">
                Email Verification Failed
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {errorMessage}
              </p>
              <p className="mb-8 text-sm text-gray-500 dark:text-gray-500">
                The verification link may be invalid or expired. Please request a new verification email.
              </p>
              <div className="space-y-4">
                <button
                  onClick={resendVerification}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </button>
                <div>
                  <Link
                    href="/auth/signin"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-12.5 pt-32.5 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
      <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
        <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:to-[#252A42]"></div>
        <div className="absolute bottom-17.5 left-0 -z-1 h-1/3 w-full">
          <div className="relative h-20 w-full"></div>
        </div>

        <div className="rounded-lg bg-white px-7.5 pt-7.5 shadow-md dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15">
          <div className="text-center">
            <Mail className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="mb-4 text-2xl font-semibold text-black dark:text-white">
              Email Verification
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Processing verification...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
