import axios from "axios";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Registration = () => {
  const [uname, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState({});

  // let data = useSelector((demo) => console.log(demo));

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${backendUrl}/api/v1/backend/auth/register`,
      headers: {
        "Content-Type": "multipart/form-data",
        // "Content-Type": "application/json",
      },
      data: {
        uname,
        email,
        password,
        image_upload: image,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log("backend response", response.data);

        if ("error" in response.data) {
          if ("uname" in response.data.error) {
            setError({ uname: response.data.error.uname });
          } else if ("email" in response.data.error) {
            setError({ email: response.data.error.email });
          } else if ("validEmail" in response.data.error) {
            setError({ email: response.data.error.validEmail });
          } else if ("password" in response.data.error) {
            setError({ password: response.data.error.password });
          } else if ("passwordLength" in response.data.error) {
            setError({ password: response.data.error.passwordLength });
          } else if ("image" in response.data.error) {
            setError({ image: response.data.error.image });
          }
        } else if ("success" in response.data) {
          setUname("");
          setPassword("");
          setEmail("");
          setImage("");
          setError("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='bg-[url("/bg.svg")] bg-cover bg-center h-screen flex items-center px-3'>
      <div className="h-[90%] w-[1320px] mx-auto flex justify-center bg-white bg-opacity-5 rounded-xl shadow-md backdrop-blur-md overflow-hidden">
        <div className="w-1/2 hidden md:block bg-[url('/rgbg.webp')] bg-cover bg-center h-full"></div>
        <div className="flex flex-col items-center justify-center h-full md:w-1/2 md:items-end md:pr-16 lg:pr-40">
          <h1 className="text-2xl font-bold text-center text-white md:text-3xl md:text-right">
            Get started with easily register
          </h1>
          <p className="text-base text-[#ddd] mt-1 mb-6">
            Free register and you can enjoy it
          </p>
          <div className="flex flex-col gap-y-6">
            <div className="relative">
              <fieldset className="px-2 pb-2 border border-white/75">
                <legend className="px-2 text-xs text-white/70">
                  Full name
                </legend>
                <input
                  className="px-2 text-white bg-transparent border-0 outline-none ring-0"
                  type="text"
                  name="uname"
                  value={uname}
                  onChange={(e) => setUname(e.target.value)}
                />
              </fieldset>

              {error.uname != "" && (
                <p className="absolute bottom-[-2px] right-0 translate-y-full text-xs text-red-500 font-semibold">
                  {error.uname}
                </p>
              )}
            </div>

            <div className="relative">
              <fieldset className="px-2 pb-2 border border-white/75">
                <legend className="px-2 text-xs text-white/70">
                  Email Address
                </legend>
                <input
                  className="px-2 text-white bg-transparent border-0 outline-none ring-0"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </fieldset>

              {error.email != "" && (
                <p className="absolute bottom-[-2px] right-0 translate-y-full text-xs text-red-500 font-semibold">
                  {error.email}
                </p>
              )}
              {error.validEmail != "" && (
                <p className="absolute bottom-[-2px] right-0 translate-y-full text-xs text-red-500 font-semibold">
                  {error.validEmail}
                </p>
              )}
            </div>

            <div className="relative">
              <fieldset className="relative px-2 pb-2 border border-white/75">
                <legend className="px-2 text-xs text-white/70">Password</legend>
                <input
                  className="px-2 text-white bg-transparent border-0 outline-none ring-0"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <IoMdEye className="absolute right-4 top-[5px] text-white/60 cursor-pointer" />

                <IoMdEyeOff className="absolute right-4 top-[5px] text-white/60 cursor-pointer" />
              </fieldset>

              {error.password != "" && (
                <p className="absolute bottom-[-2px] right-0 translate-y-full text-xs text-red-500 font-semibold">
                  {error.password}
                </p>
              )}
              {error.passwordLength != "" && (
                <p className="absolute bottom-[-2px] right-0 translate-y-full text-xs text-red-500 font-semibold">
                  {error.passwordLength}
                </p>
              )}
            </div>

            <div className="relative">
              <fieldset className="px-2 pb-2 border border-white/75">
                <legend className="px-2 text-xs text-white/70">Photo</legend>
                <input
                  className="px-2 text-white bg-transparent border-0 outline-none ring-0"
                  type="file"
                  name="image_upload"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </fieldset>

              {error.image != "" && (
                <p className="absolute bottom-[-2px] right-0 translate-y-full text-xs text-red-500 font-semibold">
                  {error.image}
                </p>
              )}
            </div>

            <input
              className="w-full py-3 mt-5 bg-blue-400 rounded cursor-pointer mb-7"
              type="button"
              value="Sign up"
              onClick={handleSubmit}
            />
          </div>
          <p className="text-base text-white/70">
            Already have an account ?{" "}
            <span className="text-red-500 cursor-pointer">
              <Link to="/">Sign in</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
