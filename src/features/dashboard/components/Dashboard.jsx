import { useEffect } from "react";
import {
    User, CreditCard, BookOpen, Wallet,
    ArrowRight, TrendingUp, Shield, Bell, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore";
import { useAccountsStore } from "../../accounts/store/accountsStore";
import { showError } from "../../../shared/utils/toast";

const cuentaConfig = {
    MONETARIA:        { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.2)" },
    AHORRO:           { color: "#6366f1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.2)" },
    AHORRO_PROGRAMADO:{ color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)" },
};

const formatBalance = (amount) =>
    `Q ${Number(amount).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`;

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { accounts, loading, getMyAccounts } = useAccountsStore();

    useEffect(() => {
        if (user?.id) {
            getMyAccounts(user.id).catch((err) => {
                showError(err?.response?.data?.message || "Error al cargar cuentas");
            });
        }
    }, [user?.id]);

    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);

    const accesos = [
        { label: "Mis Cuentas",  icon: Wallet,     path: "/dashboard/accounts",   color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)"  },
        { label: "Mis Tarjetas", icon: CreditCard,  path: "/dashboard/cards",      color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.2)"  },
        { label: "Mis Libretas", icon: BookOpen,    path: "/dashboard/passbooks",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
        { label: "Mi Perfil",    icon: User,        path: "/dashboard/users",      color: "#38bdf8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.2)"  },
    ];

    const nombre   = user?.nombre   || "—";
    const apellido = user?.apellido || "—";
    const username = user?.username || "—";

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">

            {/* BIENVENIDA */}
            <div className="relative rounded-2xl p-6 mb-8 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(7,12,20,0.95) 0%, rgba(10,22,40,0.95) 100%)",
                    border: "1px solid rgba(16,185,129,0.15)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}>
                <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)" }} />

                <div className="flex items-center justify-between relative flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)", boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}>
                            {nombre[0]}{apellido[0]}
                        </div>
                        <div>
                            <p className="text-slate-500 text-[12px] mb-0.5">Bienvenido de vuelta</p>
                            <h1 className="text-white text-xl font-bold tracking-tight">
                                {nombre} {apellido}
                            </h1>
                            <p className="text-emerald-500/80 text-[11px]">@{username}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                        style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px] font-semibold">Cliente NovaPay</span>
                    </div>
                </div>
            </div>

            {/* RESUMEN */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                    { label: "Cuentas activas", value: loading ? "—" : accounts.length,          icon: Wallet,     color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
                    { label: "Balance total",   value: loading ? "—" : formatBalance(totalBalance), icon: TrendingUp, color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)" },
                    { label: "Mi perfil",       value: `@${username}`,                             icon: User,       color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)" },
                ].map(({ label, value, icon: Icon, color, bg, border }) => (
                    <div key={label} className="rounded-2xl p-4"
                        style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                            style={{ background: bg, border: `1px solid ${border}` }}>
                            <Icon className="w-4 h-4" style={{ color }} />
                        </div>
                        <p className="text-white font-bold text-lg leading-none mb-1">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-500" /> : value}
                        </p>
                        <p className="text-slate-500 text-[11px]">{label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ACCESOS DIRECTOS */}
                <div className="rounded-2xl p-5"
                    style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">
                        Accesos rápidos
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {accesos.map(({ label, icon: Icon, path, color, bg, border }) => (
                            <button key={label} onClick={() => navigate(path)}
                                className="flex flex-col items-start gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{ background: bg, border: `1px solid ${border}` }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: "rgba(0,0,0,0.2)" }}>
                                    <Icon className="w-4 h-4" style={{ color }} />
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-white text-[13px] font-semibold">{label}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* MIS CUENTAS RESUMEN */}
                <div className="rounded-2xl p-5"
                    style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                            Mis cuentas
                        </p>
                        <button onClick={() => navigate("/dashboard/accounts")}
                            className="flex items-center gap-1 text-[11px] text-emerald-500 hover:text-emerald-400 transition-colors font-medium">
                            Ver todas <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                        </div>
                    ) : accounts.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-600 text-[13px]">No tienes cuentas activas.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {accounts.map(cuenta => {
                                const config = cuentaConfig[cuenta.tipo] || cuentaConfig[cuenta.tipo_cuenta] || cuentaConfig.MONETARIA;
                                return (
                                    <div key={cuenta.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                                        style={{ background: "rgba(4,8,16,0.5)", border: "1px solid rgba(30,41,59,0.8)" }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ background: config.bg, border: `1px solid ${config.border}` }}>
                                                <Wallet className="w-3.5 h-3.5" style={{ color: config.color }} />
                                            </div>
                                            <div>
                                                <p className="text-slate-200 text-[13px] font-medium">
                                                    {cuenta.nombre_cuenta || cuenta.tipo || "Cuenta"}
                                                </p>
                                                <p className="text-slate-600 text-[10px] font-mono">**** {cuenta.numero_cuenta?.slice(-4)}</p>
                                            </div>
                                        </div>
                                        <p className="text-[13px] font-bold" style={{ color: config.color }}>
                                            {formatBalance(cuenta.balance)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* NOTIFICACIÓN */}
            <div className="mt-6 flex items-start gap-3 px-5 py-4 rounded-2xl"
                style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)" }}>
                <Bell className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-slate-500 text-[12px] leading-relaxed">
                    Recuerda mantener tus datos actualizados. Puedes editar tu información personal desde la sección <span className="text-emerald-500 font-medium">Mi Perfil</span>.
                </p>
            </div>
        </div>
    );
};
