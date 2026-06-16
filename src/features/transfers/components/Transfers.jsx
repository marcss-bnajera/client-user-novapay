import { useState, useEffect } from "react";
import {
    Send,
    ArrowRightLeft,
    User,
    FileText,
    DollarSign,
    HelpCircle,
    CheckCircle2,
    AlertCircle,
    Wallet,
    Loader2
} from "lucide-react";
import { useAuthStore } from "../../auth/store/authStore";
import { useAccountsStore } from "../../accounts/store/accountsStore";
import { useTransfersStore } from "../store/transfersStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

export const Transfers = () => {
    const { user } = useAuthStore();
    const { accounts, getMyAccounts } = useAccountsStore();
    const { makeTransfer, loading } = useTransfersStore();

    const [formData, setFormData] = useState({
        account_origin_id: "",
        numero_cuenta_destino: "",
        amount: "",
        description: ""
    });
    const [activeAccount, setActiveAccount] = useState(null);
    const [errors, setErrors] = useState({});
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        if (user?.id) {
            getMyAccounts(user.id).catch((err) => {
                showError(err?.response?.data?.message || "Error al cargar cuentas");
            });
        }
    }, [user?.id]);

    useEffect(() => {
        if (accounts.length > 0 && !formData.account_origin_id) {
            setFormData((prev) => ({ ...prev, account_origin_id: accounts[0].id }));
            setActiveAccount(accounts[0]);
        }
    }, [accounts]);

    const handleAccountChange = (e) => {
        const accId = Number(e.target.value);
        const selected = accounts.find((acc) => acc.id === accId);
        setActiveAccount(selected);
        setFormData((prev) => ({ ...prev, account_origin_id: accId }));
        setErrors((prev) => ({ ...prev, account_origin_id: "" }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setStatusMessage(null);

        let sanitized = value;
        if (name === "numero_cuenta_destino") {
            sanitized = value.replace(/[^0-9]/g, "");
        }
        if (name === "amount") {
            sanitized = value.replace(/[^0-9.]/g, "");
        }
        setFormData((prev) => ({ ...prev, [name]: sanitized }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.account_origin_id) newErrors.account_origin_id = "Selecciona una cuenta origen";
        if (!formData.numero_cuenta_destino.trim()) newErrors.numero_cuenta_destino = "Ingresa el número de cuenta destino";
        else if (!/^\d+$/.test(formData.numero_cuenta_destino)) newErrors.numero_cuenta_destino = "Solo se permiten números";

        if (!formData.amount) newErrors.amount = "Ingresa el monto";
        else if (isNaN(formData.amount) || Number(formData.amount) <= 0) newErrors.amount = "Ingresa un monto válido";
        else if (activeAccount && Number(formData.amount) > parseFloat(activeAccount.balance))
            newErrors.amount = "Saldo insuficiente en la cuenta seleccionada";

        if (!formData.description.trim()) newErrors.description = "El motivo es obligatorio";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage(null);
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await makeTransfer({
                account_origin_id: Number(formData.account_origin_id),
                numero_cuenta_destino: formData.numero_cuenta_destino,
                amount: Number(formData.amount),
                description: formData.description,
            });
            showSuccess("¡Transferencia realizada con éxito!");
            setStatusMessage({ success: true, message: "¡Transferencia realizada con éxito! Los saldos han sido actualizados." });
            setFormData((prev) => ({ ...prev, numero_cuenta_destino: "", amount: "", description: "" }));
            if (user?.id) getMyAccounts(user.id);
        } catch (err) {
            const message = err?.response?.data?.message || "Error al realizar la transferencia";
            showError(message);
            setStatusMessage({ success: false, message });
        }
    };

    return (
        <div className="max-w-xl mx-auto py-8 px-4">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Transferencias NovaPay</h1>
                <p className="text-slate-500 text-[13px]">Envía fondos de forma inmediata a otras cuentas internas</p>
            </div>

            {/* BANNER INFORMATIVO */}
            <div className="relative rounded-2xl p-4 mb-6 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(16,185,129,0.04) 100%)",
                    border: "1px solid rgba(99,102,241,0.15)",
                }}>
                <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0">
                        <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
                    </div>
                    <p className="text-slate-400 text-[12px] leading-relaxed">
                        Las transferencias entre cuentas NovaPay no generan comisión y se liquidan en tiempo real bajo entorno seguro.
                    </p>
                </div>
            </div>

            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl p-6 transition-all"
                style={{
                    background: "rgba(7,12,20,0.8)",
                    border: "1px solid rgba(255,255,255,0.03)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}>

                {/* 1. CUENTA ORIGEN */}
                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Cuenta de Origen
                    </label>
                    <div className="relative">
                        <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <select
                            name="account_origin_id"
                            value={formData.account_origin_id}
                            onChange={handleAccountChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-slate-200 outline-none transition-all cursor-pointer appearance-none"
                            style={{ background: "rgba(4,8,16,0.6)", border: errors.account_origin_id ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(30,41,59,0.9)" }}
                        >
                            {accounts.length === 0 && <option value="">Sin cuentas disponibles</option>}
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id} className="bg-[#070c14]">
                                    No. {acc.numero_cuenta} ({acc.tipo}) — Q {Number(acc.balance).toLocaleString("es-GT")}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.account_origin_id && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.account_origin_id}</p>}
                    {activeAccount && (
                        <div className="mt-2 text-[12px] text-slate-500 flex justify-between px-1">
                            <span>Saldo disponible:</span>
                            <span className="text-emerald-400 font-medium">
                                Q {Number(activeAccount.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    )}
                </div>

                {/* 2. CUENTA DESTINO */}
                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Número de Cuenta Destino
                    </label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input
                            type="text"
                            name="numero_cuenta_destino"
                            placeholder="Ej. 99203145"
                            value={formData.numero_cuenta_destino}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all"
                            style={{ background: "rgba(4,8,16,0.6)", border: errors.numero_cuenta_destino ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(30,41,59,0.9)" }}
                            onFocus={(e) => !errors.numero_cuenta_destino && (e.target.style.borderColor = "rgba(99,102,241,0.4)")}
                            onBlur={(e) => !errors.numero_cuenta_destino && (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                        />
                    </div>
                    {errors.numero_cuenta_destino && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.numero_cuenta_destino}</p>}
                </div>

                {/* 3. MONTO */}
                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Monto a Transferir (GTQ)
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input
                            type="text"
                            name="amount"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all"
                            style={{ background: "rgba(4,8,16,0.6)", border: errors.amount ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(30,41,59,0.9)" }}
                            onFocus={(e) => !errors.amount && (e.target.style.borderColor = "rgba(99,102,241,0.4)")}
                            onBlur={(e) => !errors.amount && (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                        />
                    </div>
                    {errors.amount && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.amount}</p>}
                </div>

                {/* 4. DESCRIPCIÓN */}
                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Motivo / Descripción
                    </label>
                    <div className="relative">
                        <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                        <textarea
                            name="description"
                            rows="2"
                            placeholder="Ej. Pago de cena, transferencia a cuenta propia..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all resize-none"
                            style={{ background: "rgba(4,8,16,0.6)", border: errors.description ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(30,41,59,0.9)" }}
                            onFocus={(e) => !errors.description && (e.target.style.borderColor = "rgba(99,102,241,0.4)")}
                            onBlur={(e) => !errors.description && (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                        />
                    </div>
                    {errors.description && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.description}</p>}
                </div>

                {/* BOTÓN */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 mt-2 rounded-xl text-[13px] font-bold text-[#030712] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                        boxShadow: "0 4px 14px rgba(99,102,241,0.25)"
                    }}
                >
                    {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                    ) : (
                        <><Send className="w-4 h-4" /> Transferir Fondos</>
                    )}
                </button>

                {/* FEEDBACK */}
                {statusMessage && (
                    <div className="mt-4 p-4 rounded-xl text-[12.5px] border flex items-start gap-3"
                        style={{
                            background: statusMessage.success ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                            borderColor: statusMessage.success ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                            color: statusMessage.success ? "#34d399" : "#f87171"
                        }}>
                        {statusMessage.success ? (
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        )}
                        <p>{statusMessage.message}</p>
                    </div>
                )}
            </form>

            <div className="mt-6 flex items-center justify-between text-[11px] text-slate-600 px-2">
                <span className="flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> ¿Necesitas ayuda?
                </span>
                <span>NovaPay Core S.A. 2026</span>
            </div>
        </div>
    );
};
