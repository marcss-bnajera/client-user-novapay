import { useState, useEffect } from "react";
import { Package, Search, Tag, ChevronDown, ChevronUp, Sparkles, Loader2 } from "lucide-react";
import { useProductsStore } from "../store/productsStore";
import { showError } from "../../../shared/utils/toast";

const categoryConfig = {
    Seguros:     { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)"  },
    Préstamos:   { color: "#6366f1", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.2)"  },
    Inversiones: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
    Ahorro:      { color: "#38bdf8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.2)"  },
    General:     { color: "#ec4899", bg: "rgba(236,72,153,0.1)",  border: "rgba(236,72,153,0.2)"  },
};

const formatPrice = (price) =>
    Number(price) === 0
        ? "Gratis"
        : `Q ${Number(price).toLocaleString("es-GT", { minimumFractionDigits: 2 })} / mes`;

export const Products = () => {
    const { products, loading, getProducts } = useProductsStore();
    const [searchTerm,       setSearchTerm]       = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [expandedId,       setExpandedId]        = useState(null);

    useEffect(() => {
        getProducts().catch((err) => {
            showError(err?.response?.data?.message || "Error al cargar productos");
        });
    }, []);

    const activeProducts = products.filter(p => p.state === "ACTIVE" || p.estado === "ACTIVE");

    const categories = ["Todos", ...new Set(activeProducts.map(p => p.category))].filter(Boolean);

    const filtered = activeProducts.filter(p => {
        const matchSearch   = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              p.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory === "Todos" || p.category === selectedCategory;
        return matchSearch && matchCategory;
    });

    const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">

            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Productos NovaPay</h1>
                <p className="text-slate-500 text-[13px]">Explora los servicios financieros disponibles para ti</p>
            </div>

            {/* BANNER */}
            <div className="relative rounded-2xl p-6 mb-8 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(13,148,136,0.06) 100%)",
                    border: "1px solid rgba(16,185,129,0.18)",
                }}>
                <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)" }} />
                <div className="relative flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}>
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-[15px] mb-0.5">
                            {loading ? "—" : `${filtered.length} producto${filtered.length !== 1 ? "s" : ""} disponible${filtered.length !== 1 ? "s" : ""}`}
                        </p>
                        <p className="text-slate-500 text-[12px]">Todos los productos mostrados están activos y disponibles</p>
                    </div>
                </div>
            </div>

            {/* FILTROS */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all"
                        style={{ background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.9)" }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(16,185,129,0.4)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {categories.map(cat => {
                        const isSelected = selectedCategory === cat;
                        const c = cat === "Todos" ? { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" } : (categoryConfig[cat] || categoryConfig.General);
                        return (
                            <button key={cat} onClick={() => setSelectedCategory(cat)}
                                className="px-3 py-2 rounded-xl text-[12px] font-semibold transition-all"
                                style={{
                                    background: isSelected ? c.bg : "rgba(4,8,16,0.5)",
                                    border: isSelected ? `1px solid ${c.border}` : "1px solid rgba(30,41,59,0.8)",
                                    color: isSelected ? c.color : "#64748b",
                                }}>
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* LISTA */}
            {loading ? (
                <div className="flex items-center justify-center py-14">
                    <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-14 rounded-2xl"
                    style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)" }}>
                    <Package className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-600 text-[13px]">No se encontraron productos.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map(product => {
                        const c = categoryConfig[product.category] || categoryConfig.General;
                        const isExpanded = expandedId === product.id;
                        const isFree = Number(product.price) === 0;

                        return (
                            <div key={product.id} className="rounded-2xl overflow-hidden transition-all"
                                style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>

                                <button onClick={() => toggleExpand(product.id)}
                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/20 transition-all text-left">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                                            <Package className="w-4 h-4" style={{ color: c.color }} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-white text-[14px] font-semibold">{product.name}</p>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                                                    style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
                                                    <Tag className="w-2.5 h-2.5" /> {product.category}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-[12px] mt-0.5 truncate">
                                                {product.description?.slice(0, 60)}...
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                        <p className="font-bold text-[14px] hidden sm:block"
                                            style={{ color: isFree ? "#10b981" : "#f8fafc" }}>
                                            {formatPrice(product.price)}
                                        </p>
                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="px-5 pb-5" style={{ borderTop: "1px solid rgba(30,41,59,0.5)" }}>
                                        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start">
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] mb-2">Descripción</p>
                                                <p className="text-slate-400 text-[13px] leading-relaxed">{product.description}</p>
                                            </div>
                                            <div className="sm:w-48 flex flex-col gap-3">
                                                <div className="px-4 py-3 rounded-xl text-center"
                                                    style={{ background: "rgba(4,8,16,0.5)", border: "1px solid rgba(30,41,59,0.8)" }}>
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.12em] mb-1">Precio</p>
                                                    <p className="font-bold text-[16px]"
                                                        style={{ color: isFree ? "#10b981" : "#f8fafc" }}>
                                                        {formatPrice(product.price)}
                                                    </p>
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
    );
};
