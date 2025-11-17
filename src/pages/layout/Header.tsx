import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartToggled } from "../cart/actions";
import { selectCart } from "../cart/selectors";
import useUserInfo from "@/hooks/useUserInfo";

const Header = () => {
    const dispatch = useDispatch();
    const { email, logOut } = useUserInfo();
    const cartItems = useSelector(selectCart);
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState<string>(() => {
        if (typeof window === "undefined") return "light";

        const stored = localStorage.getItem("theme")
        if (stored === "light" || stored === "dark") return stored;

        const prefersDark = window.matchMedia?.(
            "(prefers-color-scheme: dark)"
        ).matches;
        return prefersDark ? "dark" : "light";
    });

    const totalQuantity = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);
    }, [cartItems]);

    const onClick = useCallback(() => {
        dispatch(cartToggled());
    }, [dispatch]);

    const onLogout = useCallback(async () => {
        await logOut();
    }, [logOut]);

    const toggleMenu = useCallback(() => {
        setOpen((prev) => !prev);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    return (
        <header className="bg-white dark:bg-gray-700 dark:text-white shadow-xl z-10 sticky top-0">
            {/* main row */}
            <div className="flex items-center justify-between gap-3 px-4 py-2">
                {/* left: title */}
                <div className="font-bold">Redux Shopping Cart</div>

                {/* middle: user info (desktop) */}
                <div className="hidden items-center gap-3 md:flex">
                    <h5 className="font-semibold" role="heading" aria-level={2}>
                        Logged in as {email}
                    </h5>
                    <button
                        className="cursor-pointer underline"
                        onClick={onLogout}
                    >
                        logout
                    </button>
                </div>

                {/* right: cart + mobile toggle */}
                <div className="flex items-center gap-4">
                    {/* theme toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex h-8 w-8 items-center justify-center rounded-full border text-sm dark:border-gray-500"
                        aria-label="Toggle color theme"
                    >
                        <span aria-hidden="true">
                            {theme === "dark" ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="currentColor" viewBox="0 0 24 24" >
                                <path d="M12 17.01c2.76 0 5.01-2.25 5.01-5.01S14.76 6.99 12 6.99 6.99 9.24 6.99 12s2.25 5.01 5.01 5.01M12 9c1.66 0 3.01 1.35 3.01 3.01s-1.35 3.01-3.01 3.01-3.01-1.35-3.01-3.01S10.34 9 12 9M13 19h-2v3h2v-3M13 2h-2v3h2V2M2 11h3v2H2zM19 11h3v2h-3zM4.22 18.36l.71.71.71.71 1.06-1.06 1.06-1.06-.71-.71-.71-.71-1.06 1.06zM19.78 5.64l-.71-.71-.71-.71-1.06 1.06-1.06 1.06.71.71.71.71 1.06-1.06zM7.76 6.34 6.7 5.28 5.64 4.22l-.71.71-.71.71L5.28 6.7l1.06 1.06.71-.71zM16.24 17.66l1.06 1.06 1.06 1.06.71-.71.71-.71-1.06-1.06-1.06-1.06-.71.71z"></path>
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="currentColor" viewBox="0 0 24 24" >
                                <path d="m12.2,22c4.53,0,8.45-2.91,9.76-7.24.11-.35.01-.74-.25-1-.26-.26-.64-.36-1-.25-.78.23-1.58.35-2.38.35-4.52,0-8.2-3.68-8.2-8.2,0-.8.12-1.6.35-2.38.11-.35.01-.74-.25-1s-.64-.36-1-.25C4.91,3.35,2,7.28,2,11.8c0,5.62,4.57,10.2,10.2,10.2ZM8.18,4.65c-.03.34-.05.68-.05,1.02,0,5.62,4.57,10.2,10.2,10.2.34,0,.68-.02,1.02-.05-1.42,2.56-4.12,4.18-7.15,4.18-4.52,0-8.2-3.68-8.2-8.2,0-3.03,1.63-5.73,4.18-7.15Z"></path>
                            </svg>}
                        </span>
                    </button>

                    {/* cart (always visible) */}
                    <div className="relative">
                        <button
                            className="cursor-pointer hover:rounded-full hover:bg-gray-300 p-1"
                            onClick={onClick}
                            aria-label="cart button"
                        >
                            <svg
                                width="32"
                                height="32"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                id="injected-svg"
                            >
                                <path d="M10.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M8.82 15.77c.31.75 1.04 1.23 1.85 1.23h6.18c.79 0 1.51-.47 1.83-1.2l3.24-7.4c.14-.31.11-.67-.08-.95S21.34 7 21 7H7.33L5.92 3.62C5.76 3.25 5.4 3 5 3H2v2h2.33zM19.47 9l-2.62 6h-6.18l-2.5-6z" />
                            </svg>
                        </button>
                        <span
                            className="w-5 h-5 row-center rounded-full bg-red-600 
                                text-gray-700 font-bold -right-2 absolute text-xs top-0"
                            role="status"
                            aria-live="polite"
                            aria-label="total quantity"
                        >
                            {totalQuantity}
                        </span>
                    </div>

                    {/* mobile only: collapse toggle for user info */}
                    <button
                        className="cursor-pointer underline md:hidden"
                        onClick={toggleMenu}
                        aria-expanded={open}
                        aria-label="Toggle user menu"
                    >
                        {open ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            fill="currentColor" viewBox="0 0 24 24" >
                            <path d="M4 7H20V9H4z"></path><path d="M4 11H20V13H4z"></path><path d="M4 15H20V17H4z"></path>
                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            fill="currentColor" viewBox="0 0 24 24" >
                            <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z"></path>
                        </svg>}
                    </button>
                </div>
            </div>

            {/* collapsed user info (mobile) */}
            <div
                className={`border-t bg-white dark:bg-gray-700 md:hidden ${open ? "block" : "hidden"
                    }`}
            >
                <div className="flex flex-col gap-2 px-4 py-2">
                    <h5 className="font-semibold" role="heading" aria-level={2}>
                        Logged in as {email}
                    </h5>
                    <button
                        className="w-fit cursor-pointer underline"
                        onClick={onLogout}
                    >
                        logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
