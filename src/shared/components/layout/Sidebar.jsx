import { useState } from "react";
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
    Menu,
    X
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
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* BOTÓN HAMBURGUESA */}
            <button 
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#070c14] border border-emerald-500/10 text-slate-400 hover:text-white transition-colors"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* OVERLAY */}
            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={toggleSidebar}
                />
            )}

            {/* SIDEBAR ASIDE */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-56 flex flex-col py-5 px-3 
                bg-gradient-to-b from-[#070c14] to-[#060a10] border-r border-emerald-500/5
                transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:relative md:translate-x-0 md:min-h-[calc(100vh-4rem)]
            `}>
                
                {/* Contenedor del título */}
                <div className="pt-12 md:pt-0 mb-3">
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] px-3">
                        Menú principal
                    </p>
                </div>

                {/* Lista de navegación */}
                <ul className="space-y-1 flex-1 overflow-y-auto no-scrollbar">
                    {items.map(({ label, icon: Icon, path }) => {
                        const active = location.pathname === path;
                        return (
                            <li key={label}>
                                <Link 
                                    to={path}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group
                                        ${active 
                                            ? "text-white bg-emerald-500/10 border border-emerald-500/20" 
                                            : "text-slate-500 hover:text-slate-300 border border-transparent"
                                        }
                                    `}
                                >
                                    <Icon className={`
                                        w-4 h-4 flex-shrink-0 transition-colors
                                        ${active ? "text-emerald-500" : "text-slate-600 group-hover:text-slate-400"}
                                    `} />
                                    
                                    <span>{label}</span>

                                    {active && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Footer del Sidebar */}
                <div className="mt-4 pt-4 px-3 border-t border-slate-800/60">
                    <p className="text-[10px] text-slate-700 text-center">NovaPay Kinal Usuario © 2026</p>
                </div>
            </aside>
        </>
    );
};