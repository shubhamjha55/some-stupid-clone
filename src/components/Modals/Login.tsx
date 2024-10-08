import { authModalState } from "@/atoms/authModalAtom";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import RequestHandler, { RequestOptions } from "./RequestHandler";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
	const setAuthModalState = useSetRecoilState(authModalState);
	const handleClick = (type: "login" | "register" | "forgotPassword") => {
		setAuthModalState((prev) => ({ ...prev, type }));
	};

	const [inputs, setInputs] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputs.email || !inputs.password) {
			toast.error("Please fill all fields", { position: "top-center", autoClose: 3000, theme: "dark" });
            return;
		}
		try {
			setLoading(true);
			const requstParameter: RequestOptions = {
                method: "POST",
                url: "api/auth/login",
                body: {
                    username: inputs.email,
                    password: inputs.password,
                },
              }
              const response = await RequestHandler<{ message: string, token: string, user: any }>(requstParameter);
        
              if(response.error) {
                toast.error(response.error || "Something went wrong", { position: "top-center" });
				return;
              }
			  if(!response.data.token || !response.data.user) {
				toast.error(response.data.message || "Something went wrong", { position: "top-center" });
				return;
			  }
              toast.success("You have logged in successfully!", { position: "top-center" });

              window["accessToken"] = response.data.token;
			  window["user"] = response.data.user;
              router.push("/");
		} catch (error: any) {
			toast.error(error.message || "Error logging in", {
				position: "top-center",
				autoClose: 3000,
				theme: "dark",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="space-y-6 px-6 pb-4" onSubmit={handleLogin}>
			<h3 className="text-xl font-medium text-white">Sign in to LeetClone</h3>
			<div>
				<label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">
					Your Email
				</label>
				<input
					onChange={handleInputChange}
					type="email"
					name="email"
					id="email"
					className="
						border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
						bg-gray-600 border-gray-500 placeholder-gray-400 text-white
					"
					placeholder="name@company.com"
				/>
			</div>
			<div>
				<label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">
					Your Password
				</label>
				<input
					onChange={handleInputChange}
					type="password"
					name="password"
					id="password"
					className="
						border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
						bg-gray-600 border-gray-500 placeholder-gray-400 text-white
					"
					placeholder="*******"
				/>
			</div>

			<button
				type="submit"
				className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
					text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s
				"
			>
				{loading ? "Loading..." : "Log In"}
			</button>

			<button className="flex w-full justify-end" onClick={() => handleClick("forgotPassword")}>
				<a href="#" className="text-sm block text-brand-orange hover:underline w-full text-right">
					Forgot Password?
				</a>
			</button>

			<div className="text-sm font-medium text-gray-300">
				Not Registered?{" "}
				<a href="#" className="text-blue-700 hover:underline" onClick={() => handleClick("register")}>
					Create account
				</a>
			</div>
		</form>
	);
};

export default Login;
