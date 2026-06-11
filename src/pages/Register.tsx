import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRef } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRegisterMutation } from "@/features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const thisYear = new Date().getFullYear();
  const userRef = useRef<HTMLInputElement>(null);
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9!@#$%]{8,24}$/;
  const NAME_REGEX = /^[a-zA-Z\s]{2,30}$/;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [persist, setPersist] = useLocalStorage<boolean>("persist", false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const validEmail = EMAIL_REGEX.test(email);
  const validPassword = PASSWORD_REGEX.test(password);
  const validName = NAME_REGEX.test(name);
  const [userFocus, setUserFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const passwordsMatch = password === confirmPassword;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  let canSubmit;
  if (validEmail && validPassword && validName && passwordsMatch) {
    canSubmit = true;
  } else {
    canSubmit = false;
  }

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  const handleSubmit = async () => {
    try {
      await register({ email, name, password }).unwrap();
      toast({
        variant: "default",
        title: "Success! 🎉",
        description: "User succesfully registered",
      });
      setEmail("");
      setPassword("");
      setName("");
      setConfirmPassword("");
      navigate("/login");
    } catch (err: any) {
      toast({
        variant: "default",
        title: "Error! 🎉",
        description: "Sign Up Error",
      });
    }
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleConfirmPwdInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e.target.value);
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  return (
    <div className="min-h-screen bg-gray-100 flex-col flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 flex flex-col mt-20 mb-20 md:mb-0 md:mt-4 shadow-xl animate-fade-slide-up ">
        <h1 className="text-black font-semibold text-[2rem] text-center">
          Create Account
        </h1>
        <p className="text-[1rem] text-gray-700  text-center">
          Join Coursa Learning Today
        </p>
        <div>
          <div className="flex justify-between mt-5">
            <Label htmlFor="username" className="text-gray-700">
              Name
            </Label>
            <p
              className={
                !validName && name.length > 0
                  ? "text-red-500 text-md"
                  : "hidden"
              }
            >
              Enter a valid Username
            </p>
          </div>
          <Input
            name="Name"
            type="text"
            placeholder="John Doe"
            className={`w-full mt-3 rounded-sm p-5 text-black focus:outline-none bg-gray-50  border-gray-900 ${
              !validName && name.length > 0
                ? "border-red-600 focus:border-red-600"
                : name.length === 0
                  ? "border-gray-900"
                  : "border-green-500"
            }`}
            value={name}
            onChange={handleUserInput}
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
          />
          {userFocus && name.length > 0 && !validName && (
            <div className="bg-gray-700 border border-[#C9A84C26] rounded-md p-3 mt-2 text-[0.65rem] text-[#8A93A8] space-y-1">
              <p className="text-[#C9A84C] font-semibold mb-1">
                Name requirements:
              </p>
              <p className={name.length >= 2 ? "text-green-400" : ""}>
                ✓ At least 2 characters
              </p>
              <p className={/^[a-zA-Z\s]+$/.test(name) ? "text-green-400" : ""}>
                ✓ Letters and spaces only
              </p>
            </div>
          )}
          <div className="flex justify-between mt-5">
            <Label htmlFor="email" className="text-gray-700">
              Email address
            </Label>
            <p
              className={
                !validEmail && email.length > 0
                  ? "text-red-500 text-md"
                  : "hidden"
              }
            >
              Enter a valid Email
            </p>
          </div>
          <Input
            name="email"
            type="text"
            placeholder="you@example.com"
            className={`w-full mt-3 rounded-sm p-5 text-black focus:outline-none bg-gray-50  border-gray-900 ${
              !validEmail && email.length > 0
                ? "border-red-600 focus:border-red-600"
                : email.length === 0
                  ? "border-gray-900"
                  : "border-green-500"
            }`}
            value={email}
            onChange={handleEmailInput}
          />
          <div className="flex justify-between mt-5">
            <Label htmlFor="password" className="text-gray-700 ">
              Password
            </Label>
            <p
              className={
                !validPassword && password.length > 0
                  ? "text-red-500 text-md"
                  : "hidden"
              }
            >
              Enter a valid Password
            </p>
          </div>
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`w-full mt-3 rounded-sm p-5 text-black focus:outline-none bg-gray-50 border-gray-900 ${
                !validPassword && password.length > 0
                  ? "border-red-600 focus:border-red-600"
                  : password.length === 0
                    ? "border-gray-900"
                    : "border-green-500"
              }`}
              value={password}
              onChange={handlePwdInput}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A93A8] hover:text-black mt-1.5"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {passwordFocus && password.length > 0 && !validPassword && (
              <div className="bg-gray-700 border border-[#C9A84C26] rounded-md p-3 mt-2 text-[0.65rem] text-[#8A93A8] space-y-1">
                <p className="text-[#C9A84C] font-semibold mb-1">
                  Password requirements:
                </p>
                <p className={password.length >= 8 ? "text-green-400" : ""}>
                  ✓ 8 to 24 characters
                </p>
                <p
                  className={/[A-Za-z]/.test(password) ? "text-green-400" : ""}
                >
                  ✓ At least one letter
                </p>
                <p className={/[0-9]/.test(password) ? "text-green-400" : ""}>
                  ✓ At least one number
                </p>
                <p className={/[!@#$%]/.test(password) ? "text-green-400" : ""}>
                  ✓ Allowed special characters: ! @ # $ %
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-between mt-5">
            <Label htmlFor="confirm password" className="text-gray-700 ">
              Confirm Password
            </Label>
            <p
              className={
                !passwordsMatch && confirmPassword.length > 0
                  ? "text-red-500 text-md"
                  : "hidden"
              }
            >
              Passwords do not match
            </p>
          </div>
          <div className="relative">
            <Input
              name=" confirm password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              className={`w-full mt-3 rounded-sm p-5 text-black focus:outline-none bg-gray-50 border-gray-900 ${
                !passwordsMatch && confirmPassword.length > 0
                  ? "border-red-600 focus:border-red-600"
                  : confirmPassword.length === 0
                    ? "border-gray-900"
                    : "border-green-500"
              }`}
              value={confirmPassword}
              onChange={handleConfirmPwdInput}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A93A8] hover:text-black mt-1.5"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <Button
          type="button"
          variant="default"
          title="Get started"
          className=" bg-blue-600 w-full mt-5 rounded-sm p-5"
          onClick={handleSubmit}
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>

        <div className="w-full bg-gray-200 h-px my-5"></div>
        <p className="text-center text-[1rem]">
          Already have an account?{" "}
          <span className="text-blue-800 font-semibold">
            <Link to="/login">Sign In</Link>
          </span>
        </p>
      </div>
      <p className="text-center text-gray-400 text-sm mt-4 my-3">
        © {thisYear} Coursa Learning. All rights reserved.
      </p>
    </div>
  );
}
