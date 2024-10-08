import React, { useState } from "react";
import { useRouter } from "next/router";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import { authModalState } from "@/atoms/authModalAtom";
import { useSetRecoilState } from "recoil";

const Logout: React.FC = () => {
	const [loading, setLoading] = useState(false);

	const router = useRouter();
	const setAuthModalState = useSetRecoilState(authModalState);

	const signOut = async () => {
		// Add a logout call later to also clear the context in backend
		setLoading(true);
		return new Promise<boolean>((resolve) => {
			localStorage.removeItem("authToken");
			window["accessToken"] = window["user"] = null;
			toast.success("Successfully logged out", { position: "top-center", autoClose: 3000, theme: "dark" });
			setLoading(false);
			router.push("/auth");
			setAuthModalState((prev) => ({ ...prev, isOpen: false, type: "login" }))
		});
	};

	const handleLogout = async () => {
		await signOut();
	};

	return (
		<button
			className={`bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange ${loading ? "opacity-50" : ""}`}
			onClick={handleLogout}
			disabled={loading}
		>
			<FiLogOut />
			{loading ? " Logging out..." : ""}
		</button>
	);
};

export default Logout;
