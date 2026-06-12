import { useState } from "react";
import { CreditCard, Eye, EyeOff, Wifi, ChevronDown, ChevronUp } from "lucide-react";

const mockAccounts = [
    {
        id: 1,
        nombre_cuenta: "Cuenta Principal",
        numero_cuenta: "480123456789",
        tipo_cuenta: "MONETARIA",
        cards: [
            { id: 1, numero_tarjeta: "4900011234567891", cvv: "123", fecha_expiracion: "12/27", estado: "ACTIVA", tipo_tarjeta: "DEBITO" },
            { id: 2, numero_tarjeta: "4900021234567892", cvv: "456", fecha_expiracion: "06/26", estado: "ACTIVA", tipo_tarjeta: "CREDITO" },
        ],
    },
    {
        id: 2,
        nombre_cuenta: "Cuenta de Ahorros",
        numero_cuenta: "480987654321",
        tipo_cuenta: "AHORRO",
        cards: [
            { id: 3, numero_tarjeta: "4900031234567893", cvv: "789", fecha_expiracion: "03/28", estado: "ACTIVA", tipo_tarjeta: "PREPAGO" },
            { id: 4, numero_tarjeta: "4900041234567894", cvv: "321", fecha_expiracion: "09/27", estado: "ACTIVA", tipo_tarjeta: "VIRTUAL" },
        ],
    },
];

const tipoConfig = {
    DEBITO:  { color: "#10b981", gradient: "linear-gradient(135deg, #0d9488 0%, #10b981 100%)", label: "Débito" },
    CREDITO: { color: "#8b5cf6", gradient: "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)", label: "Crédito" },
    PREPAGO: { color: "#f59e0b", gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)", label: "Prepago" },
    VIRTUAL: { color: "#38bdf8", gradient: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)", label: "Virtual" },
};

const cuentaConfig = {
    MONETARIA:   { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
    AHORRO:      { color: "#6366f1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)" },
};

const maskCard   = (n) => `**** **** **** ${n.slice(-4)}`;
const formatCard = (n) => n.replace(/(.{4})/g, "$1 ").trim();

export const Cards = () => {
    const accounts = mockAccounts;
    const totalCards = accounts.reduce((sum, acc) => sum + acc.cards.length, 0);

    const [cardStates, setCardStates] = useState({});
    const [expanded, setExpanded] = useState(
        Object.fromEntries(accounts.map(a => [a.id, true]))
    );

    const toggleCard = (cardId, field) => {
        setCardStates(prev => ({
            ...prev,
            [cardId]: { ...prev[cardId], [field]: !prev[cardId]?.[field] },
        }));
    };

    const toggleAccount = (accountId) => {
        setExpanded(prev => ({ ...prev, [accountId]: !prev[accountId] }));
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Mis Tarjetas</h1>
                <p className="text-slate-500 text-[13px]">
                    {totalCards} tarjeta{totalCards !== 1 ? "s" : ""} vinculada{totalCards !== 1 ? "s" : ""} en {accounts.length} cuenta{accounts.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* SECCIONES POR CUENTA */}
            <div className="flex flex-col gap-5">
                {accounts.map(account => {
                    const cuenta = cuentaConfig[account.tipo_cuenta] || cuentaConfig.MONETARIA;
                    const isExpanded = expanded[account.id];

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
                                        <CreditCard className="w-4 h-4" style={{ color: cuenta.color }} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-semibold text-[14px]">{account.nombre_cuenta}</p>
                                        <p className="text-slate-500 text-[11px] font-mono">**** {account.numero_cuenta.slice(-4)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-medium text-slate-500">
                                        {account.cards.length} tarjeta{account.cards.length !== 1 ? "s" : ""}
                                    </span>
                                    {isExpanded
                                        ? <ChevronUp className="w-4 h-4 text-slate-500" />
                                        : <ChevronDown className="w-4 h-4 text-slate-500" />
                                    }
                                </div>
                            </button>

                            {/* Tarjetas */}
                            {isExpanded && (
                                <div className="p-5">
                                    {account.cards.length === 0 ? (
                                        <div className="text-center py-8 rounded-xl"
                                            style={{ background: "rgba(4,8,16,0.4)", border: "1px dashed rgba(30,41,59,0.8)" }}>
                                            <CreditCard className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                                            <p className="text-slate-600 text-[13px]">Esta cuenta no tiene tarjetas asignadas.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {account.cards.map(card => {
                                                const showNumber = cardStates[card.id]?.showNumber || false;
                                                const showCvv    = cardStates[card.id]?.showCvv    || false;
                                                const tipo = tipoConfig[card.tipo_tarjeta] || tipoConfig.DEBITO;

                                                return (
                                                    <div key={card.id}
                                                        className="relative rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
                                                        style={{
                                                            background: tipo.gradient,
                                                            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
                                                        }}>

                                                        {/* Círculos decorativos */}
                                                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
                                                            style={{ background: "rgba(255,255,255,0.06)" }} />
                                                        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full pointer-events-none"
                                                            style={{ background: "rgba(255,255,255,0.04)" }} />

                                                        {/* Top — nombre + tipo de tarjeta */}
                                                        <div className="flex items-center justify-between mb-6 relative">
                                                            <div>
                                                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.15em]">NovaPay</p>
                                                                <p className="text-white/90 text-[11px] font-medium">Tarjeta {tipo.label}</p>
                                                            </div>
                                                            <Wifi className="w-5 h-5 text-white/60 rotate-90" />
                                                        </div>

                                                        {/* Número */}
                                                        <div className="flex items-center justify-between mb-5 relative">
                                                            <span className="text-white font-mono text-[14px] tracking-[0.12em] font-medium">
                                                                {showNumber ? formatCard(card.numero_tarjeta) : maskCard(card.numero_tarjeta)}
                                                            </span>
                                                            <button onClick={() => toggleCard(card.id, "showNumber")}
                                                                className="text-white/50 hover:text-white transition-colors ml-2 flex-shrink-0">
                                                                {showNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>

                                                        {/* Bottom */}
                                                        <div className="flex items-end justify-between relative">
                                                            <div className="flex gap-5">
                                                                <div>
                                                                    <p className="text-white/50 text-[9px] uppercase tracking-[0.12em] mb-0.5">Expira</p>
                                                                    <p className="text-white font-mono text-[13px] font-semibold">{card.fecha_expiracion}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-white/50 text-[9px] uppercase tracking-[0.12em] mb-0.5">CVV</p>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <p className="text-white font-mono text-[13px] font-semibold">
                                                                            {showCvv ? card.cvv : "•••"}
                                                                        </p>
                                                                        <button onClick={() => toggleCard(card.id, "showCvv")}
                                                                            className="text-white/50 hover:text-white transition-colors">
                                                                            {showCvv ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* estado + tipo en badges */}
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                                                                    style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.8)" }}>
                                                                    {tipo.label}
                                                                </span>
                                                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                                                                    style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.8)" }}>
                                                                    {card.estado}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
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