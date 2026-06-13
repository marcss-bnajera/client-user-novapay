import { useState } from "react";
import { 
    ArrowUpRight, 
    ArrowDownLeft, 
    Wallet, 
    Search, 
    Calendar, 
    Info, 
    ChevronDown, 
    ChevronUp, 
    RefreshCw,
    Layers
} from "lucide-react";

const mockTransactions = [
    {
        id: 5012,
        account_id: 1,
        type: "transfer_out",
        amount: 350.00,
        reference_account_id: 4,
        description: "Pago de servicios profesionales a compañeros",
        balance_after: 4250.00,
        createdAt: "2026-06-12T16:45:00.000Z"
    },
    {
        id: 5009,
        account_id: 1,
        type: "deposit",
        amount: 1500.00,
        reference_account_id: null,
        description: "Depósito en efectivo por ventanilla",
        balance_after: 4600.00,
        createdAt: "2026-06-11T10:12:00.000Z"
    },
    {
        id: 5005,
        account_id: 1,
        type: "transfer_in",
        amount: 800.00,
        reference_account_id: 2, // Cuenta origen
        description: "Transferencia recibida de Marcos",
        balance_after: 3100.00,
        createdAt: "2026-06-08T19:30:00.000Z"
    },
    {
        id: 5001,
        account_id: 2, // El controlador puede traer de múltiples cuentas del usuario
        type: "withdraw",
        amount: 200.00,
        reference_account_id: null,
        description: "Retiro en Cajero Automático NovaPay",
        balance_after: 2300.00,
        createdAt: "2026-06-05T08:22:00.000Z"
    }
];

// Configuración visual adaptada a los ENUMS exactos del modelo de Sequelize
const typeConfig = {
    deposit: { 
        text: "Depósito", 
        color: "#10b981", 
        bg: "rgba(16,185,129,0.1)", 
        border: "rgba(16,185,129,0.2)", 
        icon: ArrowDownLeft,
        isPositive: true 
    },
    transfer_in: { 
        text: "Transferencia Recibida", 
        color: "#38bdf8", 
        bg: "rgba(56,189,248,0.1)", 
        border: "rgba(56,189,248,0.2)", 
        icon: ArrowDownLeft,
        isPositive: true 
    },
    withdraw: { 
        text: "Retiro", 
        color: "#f59e0b", 
        bg: "rgba(245,158,11,0.1)", 
        border: "rgba(245,158,11,0.2)", 
        icon: ArrowUpRight,
        isPositive: false 
    },
    transfer_out: { 
        text: "Transferencia Enviada", 
        color: "#6366f1", 
        bg: "rgba(99,102,241,0.1)", 
        border: "rgba(99,102,241,0.2)", 
        icon: ArrowUpRight,
        isPositive: false 
    }
};

const formatPrice = (price, isPositive, forceSign = false) => {
    const formatted = `Q ${Number(price).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`;
    if (!forceSign) return formatted;
    return isPositive ? `+ ${formatted}` : `- ${formatted}`;
};

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("es-GT", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

export const Transactions = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("ALL");
    const [expandedId, setExpandedId] = useState(null);

    // Cálculos rápidos para el Banner de cara al usuario
    const totalIncome = mockTransactions
        .filter(t => typeConfig[t.type].isPositive)
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = mockTransactions
        .filter(t => !typeConfig[t.type].isPositive)
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const filteredTransactions = mockTransactions.filter(t => {
        const config = typeConfig[t.type];
        const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            config.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.id.toString().includes(searchTerm);
        
        const matchType = selectedType === "ALL" || 
                          (selectedType === "IN" && config.isPositive) || 
                          (selectedType === "OUT" && !config.isPositive);

        return matchSearch && matchType;
    });

    const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Movimientos de Cuenta</h1>
                <p className="text-slate-500 text-[13px]">Monitorea tus ingresos, egresos y transferencias</p>
            </div>

            {/* BANNER DE RESUMEN DE FLUJOS */}
            <div className="relative rounded-2xl p-6 mb-8 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(30,41,59,0.4) 0%, rgba(15,23,42,0.6) 100%)",
                    border: "1px solid rgba(255,255,255,0.05)",
                }}>
                <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)" }} />
                
                <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/60">
                    {/* Ingresos */}
                    <div className="flex items-center gap-4 pb-3 sm:pb-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                            <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[11px] uppercase font-bold tracking-wider">Total Ingresos Recientes</p>
                            <p className="text-emerald-400 font-bold text-xl mt-0.5">{formatPrice(totalIncome, true)}</p>
                        </div>
                    </div>
                    
                    {/* Egresos */}
                    <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:pl-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
                            <ArrowUpRight className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[11px] uppercase font-bold tracking-wider">Total Retiros / Envios</p>
                            <p className="text-slate-300 font-bold text-xl mt-0.5">{formatPrice(totalExpense, false)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTROS (BÚSQUEDA Y TIPO DE FLUJO) */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Input Buscar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                        type="text"
                        placeholder="Buscar por descripción, tipo o ID de transacción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all"
                        style={{ background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.9)" }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.4)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                    />
                </div>

                {/* Filtros rápidos: Todos, Entradas, Salidas */}
                <div className="flex gap-2">
                    {[
                        { id: "ALL", label: "Todos" },
                        { id: "IN",  label: "Ingresos" },
                        { id: "OUT", label: "Egresos" }
                    ].map(tab => {
                        const isSelected = selectedType === tab.id;
                        return (
                            <button key={tab.id}
                                onClick={() => setSelectedType(tab.id)}
                                className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-all"
                                style={{
                                    background: isSelected ? "rgba(99,102,241,0.15)" : "rgba(4,8,16,0.5)",
                                    border: isSelected ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(30,41,59,0.8)",
                                    color: isSelected ? "#818cf8" : "#64748b",
                                }}>
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* LISTA DE TRANSACCIONES */}
            {filteredTransactions.length === 0 ? (
                <div className="text-center py-14 rounded-2xl"
                    style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(30,41,59,0.5)" }}>
                    <RefreshCw className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-600 text-[13px]">No hay transacciones registradas que coincidan.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredTransactions.map(tx => {
                        const typeInfo = typeConfig[tx.type];
                        const TxIcon = typeInfo.icon;
                        const isExpanded = expandedId === tx.id;

                        return (
                            <div key={tx.id} className="rounded-2xl overflow-hidden transition-all"
                                style={{
                                    background: "rgba(7,12,20,0.8)",
                                    border: "1px solid rgba(255,255,255,0.03)",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                                }}>

                                {/* FILA PRINCIPAL */}
                                <button
                                    onClick={() => toggleExpand(tx.id)}
                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/20 transition-all text-left">
                                    
                                    <div className="flex items-center gap-4 min-w-0">
                                        {/* Icono de Dirección de Flujo */}
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: typeInfo.bg, border: `1px solid ${typeInfo.border}` }}>
                                            <TxIcon className="w-4 h-4" style={{ color: typeInfo.color }} />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-white text-[14px] font-semibold truncate max-w-[180px] sm:max-w-none">
                                                    {tx.description || typeInfo.text}
                                                </p>
                                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                                                    style={{ background: typeInfo.bg, border: `1px solid ${typeInfo.border}`, color: typeInfo.color }}>
                                                    {typeInfo.text}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-[12px] mt-0.5 flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(tx.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Monto e Indicador Expand */}
                                    <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                                        <div className="text-right">
                                            <p className="font-bold text-[14px]" 
                                               style={{ color: typeInfo.isPositive ? "#10b981" : "#f8fafc" }}>
                                                {formatPrice(tx.amount, typeInfo.isPositive, true)}
                                            </p>
                                        </div>
                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                    </div>
                                </button>

                                {/* DETALLE EXPANDIDO (VISTA AUDITORÍA DE SALDOS) */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 transition-all"
                                        style={{ borderTop: "1px solid rgba(30,41,59,0.5)" }}>
                                        
                                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            
                                            {/* ID Transacción */}
                                            <div className="p-3 rounded-xl" style={{ background: "rgba(4,8,16,0.4)", border: "1px solid rgba(30,41,59,0.6)" }}>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <Info className="w-3 h-3" /> ID Transacción
                                                </p>
                                                <p className="text-slate-300 font-mono text-[13px]">#TX-NOVAPAY-{tx.id}</p>
                                            </div>

                                            {/* Cuenta de Origen del Usuario */}
                                            <div className="p-3 rounded-xl" style={{ background: "rgba(4,8,16,0.4)", border: "1px solid rgba(30,41,59,0.6)" }}>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <Wallet className="w-3 h-3" /> ID Cuenta Interna
                                                </p>
                                                <p className="text-slate-300 text-[13px]">Cuenta ID: {tx.account_id}</p>
                                            </div>

                                            {/* Saldo Posterior */}
                                            <div className="p-3 rounded-xl" style={{ background: "rgba(4,8,16,0.4)", border: "1px solid rgba(30,41,59,0.6)" }}>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <Layers className="w-3 h-3" /> Saldo Posterior
                                                </p>
                                                <p className="text-slate-200 font-semibold text-[13px]">
                                                    {formatPrice(tx.balance_after, true)}
                                                </p>
                                            </div>

                                        </div>

                                        {/* Si hay cuenta de referencia (transferencias), mostrarla */}
                                        {tx.reference_account_id && (
                                            <div className="mt-3 p-3 rounded-xl flex items-center justify-between text-[12px]"
                                                style={{ background: "rgba(99,102,241,0.03)", border: "1px solid rgba(99,102,241,0.1)" }}>
                                                <span className="text-slate-500 font-medium">Cuenta de Terceros Involucrada:</span>
                                                <span className="text-indigo-400 font-mono font-bold">Cuenta ID: #{tx.reference_account_id}</span>
                                            </div>
                                        )}

                                        {/* Pie de Auditoría */}
                                        <div className="mt-4 pt-3 flex justify-between items-center border-t border-dashed border-slate-800 text-[11px] text-slate-500">
                                            <p>NovaPay Core Banking System</p>
                                            <span className="text-slate-600">Fondos auditados correctamente</span>
                                        </div>

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