import { ROUTES } from "@/constants/routes"
import useUserInfo from "@/hooks/useUserInfo"
import { useCallback, useState } from "react"
import { Link } from "react-router-dom"

export default function Login() {
    const { loginAction, MSLoginAction, googleLoginAction } = useUserInfo()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false);

    const onLogin = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const err = await loginAction({ email, password });
            if (err) setError(err);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unexpected error");
        } finally {
            setSubmitting(false);
        }
    }, [email, password, loginAction]);

    const onMsLogin = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const err = await MSLoginAction();
            if (err) setError(err);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unexpected error");
        } finally {
            setSubmitting(false);
        }
    }, [MSLoginAction]);

    return (
        <div className="grid place-items-center bg-stone-200 h-screen">
            <div className="w-full md:max-w-[420px] max-w-[320px] rounded-xl shadow-2xl p-6" role="region" aria-label="Login">
                <h1 className="text-2xl font-bold mb-4">Login Form</h1>

                <form onSubmit={onLogin} className="login__form space-y-2">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-gray-500 text-base">Email</label>
                        <input type="email" id="email" className="px-2 py-1 rounded-xl border"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className=" flex flex-col gap-2">
                        <label htmlFor="password" className="text-gray-500 text-base">Password</label>
                        <input type="password" id="password" className=" px-2 py-1 rounded-xl border"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-2xl py-2 bg-indigo-600 mt-4 cursor-pointer 
                        text-white hover:opacity-80 disabled:cursor-not-allowed disabled:bg-indigo-300"
                        disabled={submitting}
                    >
                        {submitting ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <div className="text-red-600 mt-2">{error && error}</div>

                <p className="mt-4 text-xs">
                    Don't have an account? <Link to={ROUTES.SIGNUP}>Sign up</Link>
                </p>

                <div className="text-center my-3"><b>OR</b></div>

                <div className="flex flex-col items-center gap-4">
                    <button onClick={googleLoginAction} className="flex px-4 py-2 bg-white rounded-xl gap-4 w-full md:w-[70%] items-center hover:opacity-60 cursor-pointer">
                        <span className="w-8 h-8">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M564 325.8C564 467.3 467.1 568 324 568C186.8 568 76 457.2 76 320C76 182.8 186.8 72 324 72C390.8 72 447 96.5 490.3 136.9L422.8 201.8C334.5 116.6 170.3 180.6 170.3 320C170.3 406.5 239.4 476.6 324 476.6C422.2 476.6 459 406.2 464.8 369.7L324 369.7L324 284.4L560.1 284.4C562.4 297.1 564 309.3 564 325.8z" />
                            </svg>
                        </span>
                        <span>Continue with Google</span>
                    </button>

                    <button onClick={onMsLogin} className="flex px-4 py-2 bg-white rounded-xl gap-4 w-full md:w-[70%] items-center hover:opacity-60 cursor-pointer">
                        <span className="w-8 h-8">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M96 96L310.6 96L310.6 310.6L96 310.6L96 96zM329.4 96L544 96L544 310.6L329.4 310.6L329.4 96zM96 329.4L310.6 329.4L310.6 544L96 544L96 329.4zM329.4 329.4L544 329.4L544 544L329.4 544L329.4 329.4z" />
                            </svg>
                        </span>
                        <span>Continue with Microsoft</span>
                    </button>

                </div>
            </div>
        </div >
    )
}