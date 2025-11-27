// UserPanelLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
import Header from "./Header";

const UserPanelLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header></Header>

            <div className="flex flex-1">
                {/* Left side: section list */}

                <aside className="w-64 bg-white border-r px-4 py-6">
                    <h2 className="mb-4 text-lg font-semibold">User Panel</h2>

                    <nav className="space-y-1 text-sm">
                        <NavLink
                            end
                            to="/user"
                            className={({ isActive }) =>
                                `block rounded px-3 py-2 ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            Info
                        </NavLink>

                        <NavLink
                            to="/user/account"
                            className={({ isActive }) =>
                                `block rounded px-3 py-2 ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            Account
                        </NavLink>

                        <NavLink
                            to="/user/purchases"
                            className={({ isActive }) =>
                                `block rounded px-3 py-2 ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            Buy products
                        </NavLink>

                        <NavLink
                            to="/user/settings"
                            className={({ isActive }) =>
                                `block rounded px-3 py-2 ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            Settings
                        </NavLink>
                    </nav>
                </aside>

                {/* Right side: main content */}
                <main className="flex-1 px-6 py-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserPanelLayout;
