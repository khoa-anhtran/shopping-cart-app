import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { userLogined } from "./actions"
import { selectAuthError, selectAuthStatus } from "./selectors"
import { notification } from "antd"

export default function Login() {

    const authStatus = useSelector(selectAuthStatus)
    const authError = useSelector(selectAuthError)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onLogin = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        dispatch(userLogined({ email, password }))
    }, [dispatch, email, password])

    useEffect(() => {
        if (authStatus === 'succeeded') {
            notification.success({
                message: "Login successfully",
            })
            navigate('/')
        }

        if (authStatus === "failed")
            notification.error({
                message: authError,
            })
    }, [authStatus, authError, navigate])

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
                        disabled={authStatus === 'loading'}
                    >
                        {authStatus === 'loading' ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <div style={{ color: 'red' }}>{authStatus === "failed" ? authError : ""}</div>

                <p className="login__hint">
                    Don't have an account? <Link to={"/signup"}>Sign up</Link>
                </p>
            </div>
        </div >
    )
}