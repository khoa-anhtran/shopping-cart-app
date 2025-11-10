import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { selectAuthError, selectAuthStatus } from "./selectors"
import { userRegistered } from "./actions"
import { notification } from "antd"

export default function Register() {
    const authStatus = useSelector(selectAuthStatus)
    const authError = useSelector(selectAuthError)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onRegister = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        dispatch(userRegistered({ email, password }))
    }, [dispatch, email, password])

    return (
        <div className="login">
            <div className="login__card" role="region" aria-label="Login">
                <h1 className="login__title">Register Form</h1>

                <form onSubmit={onRegister} className="login__form">
                    <div className="login__field">
                        <label htmlFor="email" className="login__label">Email</label>
                        <input id="email" required className="login__input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="login__field">
                        <label htmlFor="password" className="login__label">Password</label>
                        <input type="password" id="password" required className="login__input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="login__submit"
                        disabled={authStatus === 'loading'}
                    >
                        {authStatus === 'loading' ? 'Signing up…' : 'Sign up'}
                    </button>
                </form>

                <div style={{ color: 'red' }}>{authStatus === "failed" ? authError : ""}</div>

                <p className="login__hint">
                    Already have an account? <Link to={"/login"}>Sign in</Link>
                </p>
            </div>
        </div>
    )
}