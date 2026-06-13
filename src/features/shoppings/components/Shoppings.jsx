import { useState } from "react";
import { 
    ShoppingBag, 
    Search, 
    Calendar, 
    CreditCard, 
    CheckCircle2, 
    XCircle, 
    ChevronDown, 
    ChevronUp, 
    TrendingUp,
    FileText
} from "lucide-react";

const mockShoppings = [
    {
        id: 1024,
        cuenta_id: 1,
        producto_id: 1,
        monto: 150.00,
        fecha: "2026-06-12T14:30:00.000Z",
        estado: "COMPLETADO",
        product: {
            name: "Seguro de Vida Plus",
            category: "Seguros"
        }
    },
    {
        id: 1021,
        cuenta_id: 1,
        producto_id: 3,
        monto: 500.00,
        fecha: "2026-05-28T09:15:00.000Z",
        estado: "COMPLETADO",
        product: {
            name: "Fondo de Inversión Emerald",
            category: "Inversiones"
        }
    },
    {
        id: 1018,
        cuenta_id: 1,
        producto_id: 5,
        monto: 45.00,
        fecha: "2026-05-10T18:22:00.000Z",
        estado: "ANULADO",
        product: {
            name: "Seguro de Tarjeta Protegida",
            category: "Seguros"
        }
    },
    {
        id: 1005,
        cuenta_id: 1,
        producto_id: 4,
        monto: 0.00,
        fecha: "2026-04-15T11:00:00.000Z",
        estado: "COMPLETADO",
        product: {
            name: "Cuenta de Ahorro Programado",
            category: "Ahorro"
        }
    }
];

const categoryConfig = {
    Seguros:     { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)"  },
    Préstamos:   { color: "#6366f1", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.2)"  },
    Inversiones: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
    Ahorro:      { color: "#38bdf8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.2)"  },
    General:     { color: "#ec4899", bg: "rgba(236,72,153,0.1)",  border: "rgba(236,72,153,0.2)"  },
};

const statusConfig = {
    COMPLETADO: { text: "Completado", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)", icon: CheckCircle2 },
    ANULADO:    { text: "Anulado",    color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.2)",  icon: XCircle }
};

const formatPrice = (price) =>
    Number(price) === 0
        ? "Gratis"
        : `Q ${Number(price).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`;

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

export const Shoppings = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("TODOS");
    const [expandedId, setExpandedId] = useState(null);

    // Calcular total gastado en productos activos
    const totalSpent = mockShoppings
        .filter(s => s.estado === "COMPLETADO")
        .reduce((sum, s) => sum + Number(s.monto), 0);

    const filteredShoppings = mockShoppings.filter(s => {
        const matchSearch = s.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.id.toString().includes(searchTerm);
        const matchStatus = selectedStatus === "TODOS" || s.estado === selectedStatus;
        return matchSearch && matchStatus;
    });

    const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Mis Adquisiciones</h1>
                <p className="text-slate-500 text-[13px]">Historial de servicios y productos contratados en NovaPay</p>
            </div>

            {/* BANNER DE RESUMEN FINANCIERO */}
            <div className="relative rounded-2xl p-6 mb-8 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(13,148,136,0.06) 100%)",
                    border: "1px solid rgba(99,102,241,0.18)",
                }}>
                <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />
                
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[12px] uppercase font-bold tracking-wider">Inversión Total en Servicios</p>
                            <p className="text-white font-black text-2xl mt-0.5">{formatPrice(totalSpent)}</p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right border-t border-slate-800 sm:border-none pt-3 sm:pt-0">
                        <p className="text-white font-semibold text-[13px]">{mockShoppings.length} Solicitudes en total</p>
                        <p className="text-slate-500 text-[12px]">Productos enlazados a tu cuenta débito</p>
                    </div>
                </div>
            </div>

            {/* FILTROS (BÚSQUEDA Y ESTADOS) */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Input Buscar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                        type="text"
                        placeholder="Buscar por producto, ID u orden..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all"
                        style={{ background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.9)" }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.4)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                    />
                </div>

                {/* Filtros de Estado */}
                <div className="flex gap-2">
                    {["TODOS", "COMPLETADO", "ANULADO"].map(status => {
                        const isSelected = selectedStatus === status;
                        return (
                            <button key={status}
                                onClick={() => setSelectedStatus(status)}
                                className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-all capitalize"
                                style={{
                                    background: isSelected ? "rgba(99,102,241,0.15)" : "rgba(4,8,16,0.5)",
                                    border: isSelected ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(30,41,59,0.8)",
                                    color: isSelected ? "#818cf8" : "#64748b",
                                }}>
                                {status.toLowerCase()}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* LISTA DE COMPRAS */}
            {filteredShoppings.length === 0 ? (
                <div className="text-center py-14 rounded-2xl"
                    style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(99,102,241,0.1)" }}Clone>
                    <ShoppingBag className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-600 text-[13px]">No registras compras bajo este filtro.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredShoppings.map(shopping => {
                        const cat = categoryConfig[shopping.product.category] || categoryConfig.General;
                        const status = statusConfig[shopping.shoppingEstado || shopping.estado];
                        const StatusIcon = status.icon;
                        const isExpanded = expandedId === shopping.id;

                        return (
                            <div key={shopping.id} className="rounded-2xl overflow-hidden transition-all"
                                style={{
                                    background: "rgba(7,12,20,0.8)",
                                    border: "1px solid rgba(99,102,241,0.08)",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                                }}>

                                {/* FILA PRINCIPAL (ACCORDION TOGGLE) */}
                                <button
                                    onClick={() => toggleExpand(shopping.id)}
                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/20 transition-all text-left">
                                    
                                    <div className="flex items-center gap-4 min-w-0">
                                        {/* Icono de la Categoría del Producto */}
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: cat.bg, border: `1px solid ${cat.border}` }}>
                                            <ShoppingBag className="w-4 h-4" style={{ color: cat.color }} />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-white text-[14px] font-semibold">{shopping.product.name}</p>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                    style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.color }}>
                                                    {shopping.product.category}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-[12px] mt-0.5 flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(shopping.fecha)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Monto y Estado en extremo derecho */}
                                    <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                                        <div className="text-right hidden sm:block">
                                            <p className="font-bold text-[14px] text-white">
                                                {formatPrice(shopping.monto)}
                                            </p>
                                            <span className="text-[10px] inline-flex items-center gap-1 font-medium mt-0.5" style={{ color: status.color }}>
                                                <StatusIcon className="w-2.5 h-2.5" />
                                                {status.text}
                                            </span>
                                        </div>
                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                    </div>
                                </button>

                                {/* DETALLE EXPANDIDO (VISTA TICKET) */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 transition-all"
                                        style={{ borderTop: "1px solid rgba(30,41,59,0.5)" }}>
                                        
                                        {/* Datos clave estructurados como un recibo digital */}
                                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            
                                            <div className="p-3 rounded-xl" style={{ background: "rgba(4,8,16,0.4)", border: "1px solid rgba(30,41,59,0.6)" }}>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <FileText className="w-3 h-3" /> No. Comprobante
                                                </p>
                                                <p className="text-slate-300 font-mono text-[13px]">#NP-SHOP-{shopping.id}</p>
                                            </div>

                                            <div className="p-3 rounded-xl" style={{ background: "rgba(4,8,16,0.4)", border: "1px solid rgba(30,41,59,0.6)" }}>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <CreditCard className="w-3 h-3" /> Cuenta de Cargo
                                                </p>
                                                <p className="text-slate-300 text-[13px]">ID Cuenta Interna: {shopping.cuenta_id}</p>
                                            </div>

                                            <div className="p-3 rounded-xl sm:hidden block" style={{ background: "rgba(4,8,16,0.4)", border: "1px solid rgba(30,41,59,0.6)" }}>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Monto y Estado</p>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-white font-bold text-[14px]">{formatPrice(shopping.monto)}</p>
                                                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                                                        <StatusIcon className="w-3 h-3" /> {status.text}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-xl hidden sm:block" style={{ background: "rgba(4,8,16,0.4)", border: "1px solid rgba(30,41,59,0.6)" }}>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    Gestión de Estado
                                                </p>
                                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mt-0.5" style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                                                    <StatusIcon className="w-3 h-3" /> {status.text}
                                                </span>
                                            </div>

                                        </div>

                                        {/* Nota de pie de ticket de usuario */}
                                        <div className="mt-4 pt-3 flex justify-between items-center border-t border-dashed border-slate-800 text-[11px] text-slate-500">
                                            <p>NovaPay Secure Transaction</p>
                                            {shopping.estado === "COMPLETADO" && (
                                                <span className="text-emerald-500/80">Este producto se encuentra activo</span>
                                            )}
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