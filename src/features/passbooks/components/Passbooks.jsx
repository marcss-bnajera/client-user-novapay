import { useState, useEffect } from "react";
import { BookOpen, Eye, EyeOff, ChevronDown, ChevronUp, Hash, Calendar, BadgeCheck, Loader2 } from "lucide-react";
import { useAuthStore } from "../../auth/store/authStore";
import { useAccountsStore } from "../../accounts/store/accountsStore";
import { getPassbookByAccount } from "../../../shared/api/user";
import { showError } from "../../../shared/utils/toast";

const tipoLibretaConfig = {
    AHORRO:      { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", gradient: "linear-gradient(135deg, #0d9488 0%, #10b981 100%)", label: "Ahorro" },
    CORRIENTE:   { color: "#6366f1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)", gradient: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)", label: "Corriente" },
    PLAZO_FIJO:  { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)", label: "Plazo Fijo" },
    INFANTIL:    { color: "#ec4899", bg: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.25)", gradient: "linear-gradient(135deg, #db2777 0%, #ec4899 100%)", label: "Infantil" },
};

const cuentaConfig = {
    MONETARIA:         { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
    AHORRO:            { color: "#6366f1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)" },
    AHORRO_PROGRAMADO: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
};

const maskLibreta = (n) => n ? `**** **** ${n.slice(-4)}` : "****";
const formatDate  = (date) => date ? new Date(date).toLocaleDateString("es-GT", { year: "numeric", month: "long", day: "numeric" }) : "—";

export const Passbooks = () => {
    const { user } = useAuthStore();
    const { accounts, getMyAccounts } = useAccountsStore();

    const [accountsWithPassbooks, setAccountsWithPassbooks] = useState([]);
    const [loading, setLoading]  = useState(true);
    const [showNumbers, setShowNumbers] = useState({});
    const [expanded, setExpanded]       = useState({});

    useEffect(() => {
        if (!user?.id) return;
        getMyAccounts(user.id).catch((err) => {
            showError(err?.response?.data?.message || "Error al cargar cuentas");
            setLoading(false);
        });
    }, [user?.id]);

    useEffect(() => {
        if (accounts.length === 0) {
            setLoading(false);
            return;
        }
        const fetchPassbooks = async () => {
            try {
                const results = await Promise.all(
                    accounts.map(async (acc) => {
                        try {
                            const res = await getPassbookByAccount(acc.id);
                            const passbook = res.data?.passbook || null;
                            return { ...acc, passbook };
                        } catch {
                            return { ...acc, passbook: null };
                        }
                    })
                );
                setAccountsWithPassbooks(results);
                setExpanded(Object.fromEntries(results.map(a => [a.id, true])));
            } finally {
                setLoading(false);
            }
        };
        fetchPassbooks();
    }, [accounts]);

    const totalLibretas = accountsWithPassbooks.filter(a => a.passbook).length;

    const toggleNumber  = (accountId) => setShowNumbers(prev => ({ ...prev, [accountId]: !prev[accountId] }));
    const toggleAccount = (accountId) => setExpanded(prev => ({ ...prev, [accountId]: !prev[accountId] }));

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">

            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Mis Libretas</h1>
                <p className="text-slate-500 text-[13px]">
                    {loading ? "Cargando..." : `${totalLibretas} libreta${totalLibretas !== 1 ? "s" : ""} vinculada${totalLibretas !== 1 ? "s" : ""} en ${accountsWithPassbooks.length} cuenta${accountsWithPassbooks.length !== 1 ? "s" : ""}`}
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {accountsWithPassbooks.map(account => {
                        const tipo = account.tipo || account.tipo_cuenta || "MONETARIA";
                        const cuenta = cuentaConfig[tipo] || cuentaConfig.MONETARIA;
                        const isExpanded = expanded[account.id];
                        const passbook   = account.passbook;
                        const tipoPb     = passbook ? (tipoLibretaConfig[passbook.tipo_libreta] || tipoLibretaConfig.AHORRO) : null;
                        const showNumber = showNumbers[account.id] || false;

                        return (
                            <div key={account.id} className="rounded-2xl overflow-hidden"
                                style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>

                                <button onClick={() => toggleAccount(account.id)}
                                    className="w-full flex items-center justify-between px-6 py-4 transition-all hover:bg-slate-800/20"
                                    style={{ borderBottom: isExpanded ? "1px solid rgba(30,41,59,0.6)" : "none" }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: cuenta.bg, border: `1px solid ${cuenta.border}` }}>
                                            <BookOpen className="w-4 h-4" style={{ color: cuenta.color }} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-white font-semibold text-[14px]">{account.nombre_cuenta || tipo}</p>
                                            <p className="text-slate-500 text-[11px] font-mono">**** {account.numero_cuenta?.slice(-4)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-medium text-slate-500">
                                            {passbook ? "1 libreta" : "Sin libreta"}
                                        </span>
                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="p-5">
                                        {!passbook ? (
                                            <div className="text-center py-8 rounded-xl"
                                                style={{ background: "rgba(4,8,16,0.4)", border: "1px dashed rgba(30,41,59,0.8)" }}>
                                                <BookOpen className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                                                <p className="text-slate-600 text-[13px]">Esta cuenta no tiene libreta asignada.</p>
                                            </div>
                                        ) : (
                                            <div className="relative rounded-2xl overflow-hidden"
                                                style={{ background: tipoPb.gradient, boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)" }}>
                                                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.06)" }} />
                                                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)" }} />

                                                <div className="relative p-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex flex-col gap-4">
                                                        <div>
                                                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.15em]">NovaPay</p>
                                                            <p className="text-white/90 text-[12px] font-medium">Libreta {tipoPb.label}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-white/50 text-[9px] uppercase tracking-[0.12em] mb-1">Número de libreta</p>
                                                            <div className="flex items-center gap-2">
                                                                <Hash className="w-3.5 h-3.5 text-white/50" />
                                                                <span className="text-white font-mono text-[15px] tracking-[0.12em] font-semibold">
                                                                    {showNumber ? passbook.numero_libreta : maskLibreta(passbook.numero_libreta)}
                                                                </span>
                                                                <button onClick={() => toggleNumber(account.id)} className="text-white/50 hover:text-white transition-colors">
                                                                    {showNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-3.5 h-3.5 text-white/50" />
                                                            <div>
                                                                <p className="text-white/50 text-[9px] uppercase tracking-[0.12em]">Emitida el</p>
                                                                <p className="text-white text-[12px] font-medium">
                                                                    {formatDate(passbook.fecha_emision || passbook.createdAt)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex sm:flex-col items-center sm:items-end gap-2">
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.25)" }}>
                                                            <BadgeCheck className="w-3.5 h-3.5 text-white/80" />
                                                            <span className="text-[11px] font-bold text-white/80">{passbook.estado || "ACTIVA"}</span>
                                                        </div>
                                                        <span className="text-[11px] font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.8)" }}>
                                                            {tipoPb.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
