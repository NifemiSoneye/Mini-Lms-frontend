import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRef } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useLoginMutation } from "@/features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const thisYear = new Date().getFullYear();
  const userRef = useRef<HTMLInputElement>(null);
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_REGEX = /^[A-Za-z0-9!@#$%]{8,24}$/;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [persist, setPersist] = useLocalStorage<boolean>("persist", false);
  const [showPassword, setShowPassword] = useState(false);
  const validEmail = EMAIL_REGEX.test(email);
  const validPassword = PASSWORD_REGEX.test(password);
  /* const { toast } = useToast(); */
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  let canSubmit;
  if (validEmail && validPassword) {
    canSubmit = true;
  } else {
    canSubmit = false;
  }

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  const handleSubmit = async () => {
    try {
      const { accessToken } = await login({ email, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      toast({
        variant: "default",
        title: "Success! 🎉",
        description: "User succesfully logged in",
      });
      setEmail("");
      setPassword("");
      navigate("/home");
    } catch (err: any) {
      toast({
        variant: "default",
        title: "Error! 🎉",
        description: "Sign In Error",
      });
    }
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  return (
    <div className="min-h-screen bg-gray-100 flex-col flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 flex flex-col mt-20 mb-20 md:m-0 shadow-xl">
        <p className="text-blue-600 text-[15px] font-semibold my-10 text-center">
          Coursa
        </p>

        <h1 className="text-black font-semibold text-[2rem] text-center">
          Sign In
        </h1>
        <p className="text-[1rem] text-gray-700  text-center">
          Welcome back to Coursa Learning
        </p>
        <div>
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
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A93A8] hover:text-white mt-1.5"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Checkbox
            id="persist"
            checked={persist}
            onCheckedChange={(checked) => setPersist(checked as boolean)}
            className="bg-gray-300 text-black p-2 rounded-md"
          />
          <p className="text-gray-700">Keep me signed in</p>
        </div>
        <Button
          type="button"
          variant="default"
          title="Get started"
          className=" bg-blue-600 w-full mt-5 rounded-sm p-5"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Sign In"}
        </Button>

        <div className="w-full bg-gray-500 h-px my-10"></div>
        <p className="text-center text-[1rem]">
          New to Coursa?{" "}
          <span className="text-blue-800 font-semibold">
            <Link to="/register">Create an account</Link>
          </span>
        </p>
      </div>
      <p className="text-center text-gray-400 text-sm mt-4 my-3">
        © {thisYear} Coursa Learning. All rights reserved.
      </p>
    </div>
  );
}
