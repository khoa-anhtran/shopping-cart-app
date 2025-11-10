import useUserInfo from "@/hooks/useUserInfo"
import { useCallback, useEffect, useState, useTransition } from "react"
import { Link, useNavigate } from "react-router-dom"
import { STATUS } from "@/constants/api"
import { useSelector } from "react-redux"

export default function Login() {
    const { loginAction, refreshAction } = useUserInfo()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, startTransition] = useTransition()

    const navigate = useNavigate()

    const onRefresh = useCallback(async () => {
        startTransition(async () => {
            try {
                await refreshAction()
            }
            catch (err) {
                console.error(err)
            }
        })
    }, [navigate, refreshAction])

    useEffect(() => {
        onRefresh().then()
    }, [])

    const onLogin = useCallback((e: React.FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            const err = await loginAction({ email, password })
            if (err)
                setError(err)
        })
    }, [email, password, loginAction])

    return (
        <div className="login">
            <div className="login__card" role="region" aria-label="Login">
                <h1 className="login__title">Login Form</h1>

                <form onSubmit={onLogin} className="login__form">
                    <div className="login__field">
                        <label htmlFor="email" className="login__label">Email</label>
                        <input type="email" id="email" className="login__input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="login__field">
                        <label htmlFor="password" className="login__label">Password</label>
                        <input type="password" id="password" className="login__input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="login__submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <div style={{ color: 'red' }}>{error && error}</div>

                <p className="login__hint">
                    Don't have an account? <Link to={"/signup"}>Sign up</Link>
                </p>
            </div>
        </div >
    )
}