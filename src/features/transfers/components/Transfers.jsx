import { useState } from "react";
import { 
    Send, 
    ArrowRightLeft, 
    User, 
    FileText, 
    DollarSign, 
    HelpCircle, 
    CheckCircle2, 
    AlertCircle,
    Wallet
} from "lucide-react";

// Mock de las cuentas del usuario logueado para que pueda seleccionar desde cuál transferir
const mockUserAccounts = [
    { id: 1, numero_cuenta: "99203145", balance: 5400.50, tipo: "Monetaria" },
    { id: 2, numero_cuenta: "11405829", balance: 1250.00, tipo: "Ahorro Programado" }
];

export const Transfers = () => {
    // Estados del formulario basados estrictamente en el req.body de tu controlador
    const [formData, setFormData] = useState({
        account_origin_id: mockUserAccounts[0].id,
        numero_cuenta_destino: "",
        amount: "",
        description: ""
    });

    // Estados para simular la interacción/feedback del usuario
    const [activeAccount, setActiveAccount] = useState(mockUserAccounts[0]);
    const [statusMessage, setStatusMessage] = useState(null); // { success: boolean, message: string }
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAccountChange = (e) => {
        const accId = Number(e.target.value);
        const selected = mockUserAccounts.find(acc => acc.id === accId);
        setActiveAccount(selected);
        setFormData(prev => ({ ...prev, account_origin_id: accId }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage(null);

        // Validación visual de saldo en el Frontend (Tal como lo hace tu backend antes del update)
        if (parseFloat(formData.amount) > activeAccount.balance) {
            setTimeout(() => {
                setStatusMessage({
                    success: false,
                    message: "Saldo insuficiente en la cuenta seleccionada para realizar la transferencia."
                });
                setIsSubmitting(false);
            }, 800);
            return;
        }

        // Simulación de respuesta exitosa del Servidor (status 200)
        setTimeout(() => {
            setStatusMessage({
                success: true,
                message: "¡Transferencia realizada con éxito! Los saldos han sido actualizados."
            });
            setIsSubmitting(false);
            setFormData({
                account_origin_id: activeAccount.id,
                numero_cuenta_destino: "",
                amount: "",
                description: ""
            });
        }, 1200);
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
                        Las transferencias entre cuentas de **NovaPay** no generan comisión y se liquidan en tiempo real bajo entorno seguro.
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
                
                {/* 1. SELECCIONAR CUENTA ORIGEN */}
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
                            style={{ background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.9)" }}
                        >
                            {mockUserAccounts.map(acc => (
                                <option key={acc.id} value={acc.id} className="bg-[#070c14]">
                                    No. {acc.numero_cuenta} ({acc.tipo}) — Q {acc.balance.toLocaleString("es-GT")}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Visualizador de saldo de la cuenta activa */}
                    <div className="mt-2 text-[12px] text-slate-500 flex justify-between px-1">
                        <span>Saldo disponible:</span>
                        <span className="text-emerald-400 font-medium">
                            Q {activeAccount.balance.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                        </span>
                    </div>
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
                            required
                            placeholder="Ej. 99203145"
                            value={formData.numero_cuenta_destino}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all"
                            style={{ background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.9)" }}
                            onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.4)")}
                            onBlur={(e) => (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                        />
                    </div>
                </div>

                {/* 3. MONTO */}
                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Monto a Transferir (GTQ)
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input
                            type="number"
                            step="0.01"
                            name="amount"
                            required
                            min="0.01"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all"
                            style={{ background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.9)" }}
                            onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.4)")}
                            onBlur={(e) => (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                        />
                    </div>
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
                            required
                            rows="2"
                            placeholder="Ej. Pago de cena, transferencia a cuenta propia..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all resize-none"
                            style={{ background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.9)" }}
                            onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.4)")}
                            onBlur={(e) => (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                        />
                    </div>
                </div>

                {/* BOTÓN DE EJECUCIÓN */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 mt-2 rounded-xl text-[13px] font-bold text-[#030712] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                        background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", 
                        boxShadow: "0 4px 14px rgba(99,102,241,0.25)" 
                    }}
                >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? "Procesando transferencia..." : "Transferir Fondos"}
                </button>

                {/* NOTIFICACIONES DE FEEDBACK FINALES */}
                {statusMessage && (
                    <div className="mt-4 p-4 rounded-xl text-[12.5px] border flex items-start gap-3 animate-fade-in"
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

            {/* SECCIÓN RESPONSIVE */}
            <div className="mt-6 flex items-center justify-between text-[11px] text-slate-600 px-2">
                <span className="flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> ¿Necesitas ayuda?
                </span>
                <span>NovaPay Core S.A. 2026</span>
            </div>

        </div>
    );
};