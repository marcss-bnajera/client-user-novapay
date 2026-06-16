import { useEffect, useState } from "react";
import { CreditCard, Wallet, TrendingUp, Eye, EyeOff, Hash, Loader2 } from "lucide-react";
import { useAuthStore } from "../../auth/store/authStore";
import { useAccountsStore } from "../store/accountsStore";
import { showError } from "../../../shared/utils/toast";

const tipoConfig = {
    MONETARIA:         { icon: Wallet,     color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)",  label: "Monetaria" },
    AHORRO:            { icon: TrendingUp, color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)", label: "Ahorros" },
    AHORRO_PROGRAMADO: { icon: TrendingUp, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", label: "Ahorro Programado" },
};

const formatBalance = (amount) =>
    `Q ${Number(amount).toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("es-GT", { year: "numeric", month: "long", day: "numeric" }) : "—";

const maskAccount = (numero) => numero ? `**** **** ${numero.slice(-4)}` : "****";

const AccountCard = ({ account }) => {
    const [showBalance, setShowBalance] = useState(false);
    const [showNumber, setShowNumber]   = useState(false);
    const tipo = account.tipo || account.tipo_cuenta || "MONETARIA";
    const config = tipoConfig[tipo] || tipoConfig.MONETARIA;
    const Icon = config.icon;

    return (
        <div className="relative rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:translate-y-[-2px]"
            style={{
                background: "linear-gradient(135deg, rgba(7,12,20,0.95) 0%, rgba(10,22,40,0.9) 100%)",
                border: "1px solid rgba(16,185,129,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}>

            <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${config.bg} 0%, transparent 70%)` }} />

            {/* Header */}
            <div className="flex items-start justify-between relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: config.bg, border: `1px solid ${config.border}` }}>
                        <Icon className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    <div>
                        <p className="text-white font-semibold text-[14px]">
                            {account.nombre_cuenta || config.label}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.color }}>
                            {config.label}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] text-emerald-400 font-medium">{account.estado || "ACTIVA"}</span>
                </div>
            </div>

            {/* Número */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em]">
                    Número de cuenta
                </label>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: "rgba(4,8,16,0.5)", border: "1px solid rgba(30,41,59,0.8)" }}>
                    <div className="flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-slate-300 text-[13px] font-mono tracking-wider">
                            {showNumber ? account.numero_cuenta : maskAccount(account.numero_cuenta)}
                        </span>
                    </div>
                    <button onClick={() => setShowNumber(!showNumber)} className="text-slate-600 hover:text-emerald-400 transition-colors">
                        {showNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Balance */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em]">
                    Saldo disponible
                </label>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: "rgba(4,8,16,0.5)", border: "1px solid rgba(30,41,59,0.8)" }}>
                    <span className="font-bold text-[18px]" style={{ color: config.color }}>
                        {showBalance ? formatBalance(account.balance) : "Q ••••••"}
                    </span>
                    <button onClick={() => setShowBalance(!showBalance)} className="text-slate-600 hover:text-emerald-400 transition-colors">
                        {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Fecha */}
            <div className="flex items-center gap-1.5 pt-1"
                style={{ borderTop: "1px solid rgba(30,41,59,0.5)" }}>
                <CreditCard className="w-3 h-3 text-slate-700" />
                <span className="text-[11px] text-slate-700">
                    Aperturada el {formatDate(account.fecha_creacion || account.createdAt)}
                </span>
            </div>
        </div>
    );
};

export const Accounts = () => {
    const { user } = useAuthStore();
    const { accounts, loading, getMyAccounts } = useAccountsStore();
    const [showTotal, setShowTotal] = useState(false);

    useEffect(() => {
        if (user?.id) {
            getMyAccounts(user.id).catch((err) => {
                showError(err?.response?.data?.message || "Error al cargar cuentas");
            });
        }
    }, [user?.id]);

    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">

            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Mis Cuentas</h1>
                <p className="text-slate-500 text-[13px]">Visualiza todas tus cuentas vinculadas a NovaPay</p>
            </div>

            {/* RESUMEN TOTAL */}
            <div className="relative rounded-2xl p-6 mb-8 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(13,148,136,0.08) 100%)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}>
                <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)" }} />

                <div className="flex items-center justify-between relative">
                    <div>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-2">
                            Balance total
                        </p>
                        <p className="text-white text-3xl font-black tracking-tight">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-500" /> : showTotal ? formatBalance(totalBalance) : "Q ••••••••"}
                        </p>
                        <p className="text-slate-500 text-[12px] mt-1">
                            {accounts.length} cuenta{accounts.length !== 1 ? "s" : ""} activa{accounts.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <button onClick={() => setShowTotal(!showTotal)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                        style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                        {showTotal ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                    </button>
                </div>
            </div>

            {/* GRID */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                </div>
            ) : accounts.length === 0 ? (
                <div className="text-center py-16 rounded-2xl"
                    style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)" }}>
                    <CreditCard className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 text-[14px]">No tienes cuentas vinculadas aún.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {accounts.map(account => (
                        <AccountCard key={account.id} account={account} />
                    ))}
                </div>
            )}
        </div>
    );
};
