import { useLocation, Link } from "react-router-dom";
import {
    LayoutDashboard,
    Wallet,
    CreditCard,
    DollarSign,
    ArrowDownToLine,
    Star,
    BookOpen,
    Package,
    ShoppingCart,
    ArrowLeftRight,
    Users,
} from "lucide-react";

const items = [
    { label: "Dashboard",      icon: LayoutDashboard, path: "/dashboard" },
    { label: "Usuarios",      icon: Users,           path: "/dashboard/users" },
    { label: "Cuentas",       icon: Wallet,          path: "/dashboard/accounts" },
    { label: "Tarjetas",      icon: CreditCard,      path: "/dashboard/cards" },
    { label: "Libretas",      icon: BookOpen,        path: "/dashboard/passbooks" },
    { label: "Divisas",       icon: DollarSign,      path: "/dashboard/currencies" },
    { label: "Depósitos",     icon: ArrowDownToLine, path: "/dashboard/deposits" },
    { label: "Favoritos",     icon: Star,            path: "/dashboard/favorites" },
    { label: "Productos",     icon: Package,         path: "/dashboard/products" },
    { label: "Compras",       icon: ShoppingCart,    path: "/dashboard/shoppings" },
    { label: "Transacciones", icon: LayoutDashboard, path: "/dashboard/transactions" },
    { label: "Transferencias",icon: ArrowLeftRight,  path: "/dashboard/transfers" },
];

export const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-56 min-h-[calc(100vh-4rem)] flex flex-col py-5 px-3"
            style={{ background: "linear-gradient(180deg, #070c14 0%, #060a10 100%)", borderRight: "1px solid rgba(16,185,129,0.08)" }}>

            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] px-3 mb-3">
                Menú principal
            </p>

            <ul className="space-y-1 flex-1">
                {items.map(({ label, icon: Icon, path }) => {
                    const active = location.pathname === path;
                    return (
                        <li key={label}>
                            <Link to={path}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                                style={{
                                    color: active ? "#fff" : "#64748b",
                                    background: active ? "rgba(16,185,129,0.12)" : "transparent",
                                    border: active ? "1px solid rgba(16,185,129,0.2)" : "1px solid transparent",
                                }}>
                                <Icon className="w-4 h-4 flex-shrink-0"
                                    style={{ color: active ? "#10b981" : "#475569" }} />
                                {label}
                                {active && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-4 pt-4 px-3" style={{ borderTop: "1px solid rgba(30,41,59,0.6)" }}>
                <p className="text-[10px] text-slate-700 text-center">NovaPay Kinal Usuario © 2026</p>
            </div>
        </aside>
    );
};