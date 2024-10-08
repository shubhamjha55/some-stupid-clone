import { authModalState } from "@/atoms/authModalAtom";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import RequestHandler, { RequestOptions } from "./RequestHandler";

type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  
  const goToSignInPage = () => {
    setAuthModalState((prev) => ({ ...prev, type: "login" }));
  };

  const [inputs, setInputs] = useState({ email: "", displayName: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.email || !inputs.password || !inputs.displayName) {
        toast.error("Please fill all fields", { position: "top-center", autoClose: 3000, theme: "dark" });
        return;
    }
    try {
      setLoading(true);
      toast.loading("Creating your account", { position: "top-center", toastId: "loadingToast" });
    

      const requstParameter: RequestOptions = {
        method: "POST",
        url: "api/users/register",
        body: {
            username: inputs.email,
            password: inputs.password,
            firstName: inputs.displayName,
            email: inputs.email,
        },
      }
      const response = await RequestHandler<{ message: string }>(requstParameter);

      if(response.error) {
        toast.error(response.error || "Something went wrong", { position: "top-center" });
        return;
      }

      toast.success("You have successfully created your account, Please login to continue!", { position: "top-center" });
      goToSignInPage();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { position: "top-center" });
    } finally {
      setLoading(false);
      toast.dismiss("loadingToast");
    }
  };

  return (
    <form className='space-y-6 px-6 pb-4' onSubmit={handleRegister}>
      <h3 className='text-xl font-medium text-white'>Register to LeetClone</h3>
      <div>
        <label htmlFor='email' className='text-sm font-medium block mb-2 text-gray-300'>
          Email
        </label>
        <input
          onChange={handleChangeInput}
          type='email'
          name='email'
          id='email'
          className='
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white
          '
          placeholder='name@company.com'
        />
      </div>
      <div>
        <label htmlFor='displayName' className='text-sm font-medium block mb-2 text-gray-300'>
          Display Name
        </label>
        <input
          onChange={handleChangeInput}
          type='text'
          name='displayName'
          id='displayName'
          className='
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white
          '
          placeholder='John Doe'
        />
      </div>
      <div>
        <label htmlFor='password' className='text-sm font-medium block mb-2 text-gray-300'>
          Password
        </label>
        <input
          onChange={handleChangeInput}
          type='password'
          name='password'
          id='password'
          className='
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white
          '
          placeholder='*******'
        />
      </div>

      <button
        type='submit'
        className='w-full text-white focus:ring-blue-300 font-medium rounded-lg
          text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s
        '
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <div className='text-sm font-medium text-gray-300'>
        Already have an account?{" "}
        <a href='#' className='text-blue-700 hover:underline' onClick={goToSignInPage}>
          Log In
        </a>
      </div>
    </form>
  );
};

export default Signup;
