import { useState } from "react";
import { BookOpen, Eye, EyeOff, ChevronDown, ChevronUp, Hash, Calendar, BadgeCheck } from "lucide-react";

const mockAccounts = [
    {
        id: 1,
        nombre_cuenta: "Cuenta Principal",
        numero_cuenta: "480123456789",
        tipo_cuenta: "MONETARIA",
        passbook: {
            id: 1,
            numero_libreta: "480001123456",
            fecha_emision: "2024-01-15T10:00:00Z",
            estado: "ACTIVA",
            tipo_libreta: "CORRIENTE",
        },
    },
    {
        id: 2,
        nombre_cuenta: "Cuenta de Ahorros",
        numero_cuenta: "480987654321",
        tipo_cuenta: "AHORRO",
        passbook: {
            id: 2,
            numero_libreta: "480002654321",
            fecha_emision: "2024-03-20T10:00:00Z",
            estado: "ACTIVA",
            tipo_libreta: "AHORRO",
        },
    },
];

const tipoLibretaConfig = {
    AHORRO:      { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", gradient: "linear-gradient(135deg, #0d9488 0%, #10b981 100%)", label: "Ahorro" },
    CORRIENTE:   { color: "#6366f1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)", gradient: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)", label: "Corriente" },
    PLAZO_FIJO:  { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)", label: "Plazo Fijo" },
    INFANTIL:    { color: "#ec4899", bg: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.25)", gradient: "linear-gradient(135deg, #db2777 0%, #ec4899 100%)", label: "Infantil" },
};

const cuentaConfig = {
    MONETARIA:   { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
    AHORRO:      { color: "#6366f1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)" },
};

const maskLibreta = (n) => `**** **** ${n.slice(-4)}`;

const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-GT", { year: "numeric", month: "long", day: "numeric" });

export const Passbooks = () => {
    const accounts = mockAccounts;
    const totalLibretas = accounts.filter(a => a.passbook !== null).length;

    const [showNumbers, setShowNumbers] = useState({});
    const [expanded, setExpanded] = useState(
        Object.fromEntries(accounts.map(a => [a.id, true]))
    );

    const toggleNumber = (accountId) => {
        setShowNumbers(prev => ({ ...prev, [accountId]: !prev[accountId] }));
    };

    const toggleAccount = (accountId) => {
        setExpanded(prev => ({ ...prev, [accountId]: !prev[accountId] }));
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Mis Libretas</h1>
                <p className="text-slate-500 text-[13px]">
                    {totalLibretas} libreta{totalLibretas !== 1 ? "s" : ""} vinculada{totalLibretas !== 1 ? "s" : ""} en {accounts.length} cuenta{accounts.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* SECCIONES POR CUENTA */}
            <div className="flex flex-col gap-5">
                {accounts.map(account => {
                    const cuenta = cuentaConfig[account.tipo_cuenta] || cuentaConfig.MONETARIA;
                    const isExpanded = expanded[account.id];
                    const passbook = account.passbook;
                    const tipo = passbook ? (tipoLibretaConfig[passbook.tipo_libreta] || tipoLibretaConfig.AHORRO) : null;
                    const showNumber = showNumbers[account.id] || false;

                    return (
                        <div key={account.id} className="rounded-2xl overflow-hidden"
                            style={{
                                background: "rgba(7,12,20,0.8)",
                                border: "1px solid rgba(16,185,129,0.1)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                            }}>

                            {/* Header cuenta */}
                            <button
                                onClick={() => toggleAccount(account.id)}
                                className="w-full flex items-center justify-between px-6 py-4 transition-all hover:bg-slate-800/20"
                                style={{ borderBottom: isExpanded ? "1px solid rgba(30,41,59,0.6)" : "none" }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: cuenta.bg, border: `1px solid ${cuenta.border}` }}>
                                        <BookOpen className="w-4 h-4" style={{ color: cuenta.color }} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-semibold text-[14px]">{account.nombre_cuenta}</p>
                                        <p className="text-slate-500 text-[11px] font-mono">**** {account.numero_cuenta.slice(-4)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-medium text-slate-500">
                                        {passbook ? "1 libreta" : "Sin libreta"}
                                    </span>
                                    {isExpanded
                                        ? <ChevronUp className="w-4 h-4 text-slate-500" />
                                        : <ChevronDown className="w-4 h-4 text-slate-500" />
                                    }
                                </div>
                            </button>

                            {/* Contenido */}
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
                                            style={{
                                                background: tipo.gradient,
                                                boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
                                            }}>

                                            {/* Círculos decorativos */}
                                            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                                                style={{ background: "rgba(255,255,255,0.06)" }} />
                                            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
                                                style={{ background: "rgba(255,255,255,0.04)" }} />

                                            <div className="relative p-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                                {/* Izquierda */}
                                                <div className="flex flex-col gap-4">

                                                    {/* Marca + tipo */}
                                                    <div>
                                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.15em]">NovaPay</p>
                                                        <p className="text-white/90 text-[12px] font-medium">Libreta {tipo.label}</p>
                                                    </div>

                                                    {/* Número de libreta */}
                                                    <div>
                                                        <p className="text-white/50 text-[9px] uppercase tracking-[0.12em] mb-1">Número de libreta</p>
                                                        <div className="flex items-center gap-2">
                                                            <Hash className="w-3.5 h-3.5 text-white/50" />
                                                            <span className="text-white font-mono text-[15px] tracking-[0.12em] font-semibold">
                                                                {showNumber ? passbook.numero_libreta : maskLibreta(passbook.numero_libreta)}
                                                            </span>
                                                            <button onClick={() => toggleNumber(account.id)}
                                                                className="text-white/50 hover:text-white transition-colors">
                                                                {showNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Fecha emisión */}
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5 text-white/50" />
                                                        <div>
                                                            <p className="text-white/50 text-[9px] uppercase tracking-[0.12em]">Emitida el</p>
                                                            <p className="text-white text-[12px] font-medium">{formatDate(passbook.fecha_emision)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Derecha — estado + tipo badge */}
                                                <div className="flex sm:flex-col items-center sm:items-end gap-2">
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                                                        style={{ background: "rgba(0,0,0,0.25)" }}>
                                                        <BadgeCheck className="w-3.5 h-3.5 text-white/80" />
                                                        <span className="text-[11px] font-bold text-white/80">{passbook.estado}</span>
                                                    </div>
                                                    <span className="text-[11px] font-bold px-3 py-1.5 rounded-full"
                                                        style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.8)" }}>
                                                        {tipo.label}
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
        </div>
    );
};