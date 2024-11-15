/**
 * 로그인 페이지
 */
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "@/assets/images/logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your authentication logic here
    console.log("Form submitted:", formData);
    navigate("/main");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-sbtLightBlue2 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-center text-sbtDarkBlue mb-6">{isLogin ? "Login" : "Sign Up"}</h2>
          <form onSubmit={handleSubmit} className="space-y-3 p-4">
            <div className="flex justify-center items-center gap-4">
              <label htmlFor="id" className="font-medium text-sbtDarkBlue w-20">
                Email
              </label>
              <input
                id="id"
                name="id"
                type="text"
                required
                autoFocus
                value={formData.id}
                onChange={handleChange}
                className="w-72 px-3 py-2 border text-black border-sbtDarkBlue rounded-md focus:outline-none focus:ring-2 focus:ring-sbtDarkBlue"
              />
            </div>
            <div className="flex justify-center items-center gap-4">
              <label htmlFor="password" className="font-medium text-sbtDarkBlue w-20">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-72 px-3 py-2 border text-black border-sbtDarkBlue rounded-md focus:outline-none focus:ring-2 focus:ring-sbtDarkBlue"
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-sbtDarkBlue">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-sbtDarkBlue rounded-md focus:outline-none focus:ring-2 focus:ring-sbtDarkBlue"
                />
              </div>
            )}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="flex-1 px-4 py-2 bg-sbtDarkBlue text-white rounded-md hover:bg-sbtDarkBlue/90 focus:outline-none focus:ring-2 focus:ring-sbtLightBlue focus:ring-offset-2"
              >
                {isLogin ? "New" : "Back to Login"}
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-sbtDarkBlue text-white rounded-md hover:bg-sbtDarkBlue/90 focus:outline-none focus:ring-2 focus:ring-sbtLightBlue focus:ring-offset-2"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-8">
        <img src={logo} alt="SBT Global" className="h-12 w-52" />
      </div>
    </div>
  );
};

export default Login;
