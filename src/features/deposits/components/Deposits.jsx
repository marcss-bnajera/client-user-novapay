import { useState, useEffect } from "react";
import { ArrowDownToLine, Calendar, ChevronDown, ChevronUp, BadgeCheck, Search, Loader2 } from "lucide-react";
import { useAuthStore } from "../../auth/store/authStore";
import { useTransactionsStore } from "../../transactions/store/transactionsStore";
import { showError } from "../../../shared/utils/toast";

const formatBalance = (amount) =>
    `Q ${Number(amount).toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-GT", { year: "numeric", month: "long", day: "numeric" });

const formatTime = (date) =>
    new Date(date).toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });

export const Deposits = () => {
    const { user } = useAuthStore();
    const { transactions, loading, getMyTransactions } = useTransactionsStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        if (user?.id) {
            getMyTransactions(user.id).catch((err) => {
                showError(err?.response?.data?.message || "Error al cargar depósitos");
            });
        }
    }, [user?.id]);

    // Solo mostramos transacciones de tipo "deposit"
    const deposits = transactions.filter(t => t.type === "deposit");

    const filtered = deposits.filter(d =>
        searchTerm === "" ||
        d.id?.toString().includes(searchTerm) ||
        d.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.amount?.toString().includes(searchTerm)
    );

    const totalMonto = filtered.reduce((sum, d) => sum + Number(d.amount || 0), 0);

    const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">

            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Mis Depósitos</h1>
                <p className="text-slate-500 text-[13px]">Historial de depósitos recibidos en tus cuentas</p>
            </div>

            {/* RESUMEN */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl p-5"
                    style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                        <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-white font-bold text-lg leading-none mb-1">{loading ? "—" : filtered.length}</p>
                    <p className="text-slate-500 text-[11px]">Depósito{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="rounded-2xl p-5"
                    style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                        <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-emerald-400 font-bold text-lg leading-none mb-1">{loading ? "—" : formatBalance(totalMonto)}</p>
                    <p className="text-slate-500 text-[11px]">Total depositado</p>
                </div>
            </div>

            {/* BÚSQUEDA */}
            <div className="relative mb-5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                    type="text"
                    placeholder="Buscar por ID, descripción o monto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all"
                    style={{ background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.9)" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(16,185,129,0.4)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                />
            </div>

            {/* LISTA */}
            <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>

                {loading ? (
                    <div className="flex items-center justify-center py-14">
                        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-14">
                        <ArrowDownToLine className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                        <p className="text-slate-600 text-[13px]">No se encontraron depósitos.</p>
                    </div>
                ) : (
                    <div className="divide-y" style={{ borderColor: "rgba(30,41,59,0.5)" }}>
                        {filtered.map(deposit => {
                            const isExpanded = expandedId === deposit.id;
                            return (
                                <div key={deposit.id}>
                                    <button
                                        onClick={() => toggleExpand(deposit.id)}
                                        className="w-full flex items-center justify-between px-5 py-4 transition-all hover:bg-slate-800/20 text-left">

                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                                                <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-white text-[13px] font-semibold">
                                                        {deposit.description || "Depósito recibido"}
                                                    </p>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                        style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
                                                        COMPLETADO
                                                    </span>
                                                </div>
                                                <p className="text-slate-500 text-[11px]">
                                                    {formatDate(deposit.createdAt)} · {formatTime(deposit.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <p className="text-emerald-400 font-bold text-[14px]">
                                                +{formatBalance(deposit.amount)}
                                            </p>
                                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="px-5 pb-5 pt-1" style={{ borderTop: "1px solid rgba(30,41,59,0.5)" }}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                                <div className="flex flex-col gap-1.5 px-4 py-3 rounded-xl"
                                                    style={{ background: "rgba(4,8,16,0.5)", border: "1px solid rgba(30,41,59,0.8)" }}>
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.12em]">Fecha y hora</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                                                        <p className="text-slate-300 text-[13px]">{formatDate(deposit.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1.5 px-4 py-3 rounded-xl"
                                                    style={{ background: "rgba(4,8,16,0.5)", border: "1px solid rgba(30,41,59,0.8)" }}>
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.12em]">Monto depositado</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-600" />
                                                        <p className="text-emerald-400 text-[13px] font-bold">{formatBalance(deposit.amount)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
