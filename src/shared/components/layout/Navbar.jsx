import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, ArrowDownToLine, ShoppingCart, X } from "lucide-react";
import { useAuthStore } from "../../../features/auth/store/authStore";
import { useTransactionsStore } from "../../../features/transactions/store/transactionsStore";
import { useShoppingsStore } from "../../../features/shoppings/store/shoppingsStore";
import imgLogo from "../../../assets/img/logo_novapay_signo.png";

export const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { transactions, getMyTransactions } = useTransactionsStore();
    const { shoppings } = useShoppingsStore();
    const [showNotifications, setShowNotifications] = useState(false);
    const [now, setNow] = useState(() => Date.now());
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const initials = user
        ? `${user.nombre?.[0] || ""}${user.apellido?.[0] || ""}`.toUpperCase()
        : "?";

    useEffect(() => {
        if (user?.id) {
            getMyTransactions(user.id).catch(() => {});
        }
    }, [user?.id, getMyTransactions]);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    const notifications = useMemo(() => {
        const dayMs = 24 * 60 * 60 * 1000;
        const deposits = transactions.filter(t => t.type === "deposit");
        const recentDeposits = deposits.filter(d => now - new Date(d.createdAt).getTime() < dayMs);
        const recentShoppings = shoppings.filter(s => now - new Date(s.createdAt).getTime() < dayMs);

        return [
            ...recentDeposits.map(d => ({
                id: `dep-${d.id}`,
                icon: ArrowDownToLine,
                iconColor: "#10b981",
                text: `Depósito de Q ${parseFloat(d.amount || 0).toFixed(2)}`,
                time: d.createdAt,
            })),
            ...recentShoppings.map(s => ({
                id: `shop-${s.id}`,
                icon: ShoppingCart,
                iconColor: "#6366f1",
                text: `Compra: ${s.product?.name || "Producto"}`,
                time: s.createdAt,
            })),
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
    }, [transactions, shoppings, now]);

    const unreadCount = notifications.length;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatNotifTime = (date) => {
        const diff = now - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Ahora";
        if (mins < 60) return `Hace ${mins}m`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `Hace ${hours}h`;
        return `Hace ${Math.floor(hours / 24)}d`;
    };

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#060a10] via-[#0a1628] to-[#060a10] border-b border-emerald-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <div className="max-w-full mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

                {/* Logo y Nombre */}
                <div className="flex items-center gap-2 md:gap-3 pl-14 md:pl-0 transition-all">
                    <img
                        src={imgLogo}
                        alt="NovaPay Logo"
                        className="h-7 md:h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                    />

                    <div className="flex flex-col border-l border-slate-700/50 pl-2 md:pl-3">
                        <span className="text-white font-black text-sm md:text-base tracking-tighter leading-none">
                            NOVA<span className="text-emerald-400">PAY</span>
                        </span>
                        <span className="hidden sm:inline-block text-emerald-500/70 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">
                            Mi cuenta
                        </span>
                    </div>
                </div>

                {/* Notificaciones y Perfil */}
                <div className="flex items-center gap-2 md:gap-3">

                    {/* Notificaciones */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 border border-slate-700/60 transition-all"
                        >
                            <Bell className="w-4 h-4" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-emerald-500 text-[10px] font-bold text-white flex items-center justify-center px-1">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden z-50"
                                style={{
                                    background: "linear-gradient(135deg, rgba(7,12,20,0.98) 0%, rgba(10,22,40,0.98) 100%)",
                                    border: "1px solid rgba(16,185,129,0.15)",
                                    boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
                                }}>
                                <div className="flex items-center justify-between px-4 py-3"
                                    style={{ borderBottom: "1px solid rgba(30,41,59,0.7)" }}>
                                    <span className="text-white font-bold text-[13px]">Notificaciones</span>
                                    <button onClick={() => setShowNotifications(false)}
                                        className="text-slate-500 hover:text-white transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="py-8 text-center">
                                            <Bell className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                                            <p className="text-slate-600 text-[12px]">Sin notificaciones recientes</p>
                                        </div>
                                    ) : (
                                        notifications.map(notif => {
                                            const Icon = notif.icon;
                                            return (
                                                <div key={notif.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-800/30"
                                                    style={{ borderBottom: "1px solid rgba(30,41,59,0.3)" }}>
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        style={{ background: `${notif.iconColor}15`, border: `1px solid ${notif.iconColor}30` }}>
                                                        <Icon className="w-3.5 h-3.5" style={{ color: notif.iconColor }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-slate-300 text-[12px] font-medium truncate">{notif.text}</p>
                                                        <p className="text-slate-600 text-[10px]">{formatNotifTime(notif.time)}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-6 w-px bg-slate-700/50" />

                    {/* Avatar con iniciales */}
                    <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-[12px] font-bold bg-gradient-to-br from-[#10b981] to-[#0d9488] shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                        {initials}
                    </div>

                    {/* Cerrar sesión */}
                    <button
                        onClick={handleLogout}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-slate-800/60 border border-slate-700/60 transition-all"
                        title="Cerrar sesión"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
