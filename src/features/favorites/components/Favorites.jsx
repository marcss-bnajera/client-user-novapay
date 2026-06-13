import { useState } from "react";
import { Star, Plus, Search, Trash2, Edit3, User } from "lucide-react";
import { FavoriteModal } from "./FavoriteModal";

const mockFavorites = [
    { id: 1, usuario_id: 1, numero_cuenta_favorito: "480111222333", alias: "Mamá" },
    { id: 2, usuario_id: 1, numero_cuenta_favorito: "480444555666", alias: "Juan del trabajo" },
    { id: 3, usuario_id: 1, numero_cuenta_favorito: "480777888999", alias: "Arrendador" },
    { id: 4, usuario_id: 1, numero_cuenta_favorito: "480123456000", alias: "Papá" },
];

export const Favorites = () => {
    const [favorites, setFavorites]     = useState(mockFavorites);
    const [searchTerm, setSearchTerm]   = useState("");
    const [showModal, setShowModal]     = useState(false);
    const [selected, setSelected]       = useState(null);

    const filtered = favorites.filter(f =>
        f.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.numero_cuenta_favorito.includes(searchTerm)
    );

    const handleDelete = (id) => {
        if (!window.confirm("¿Eliminar este favorito?")) return;
        setFavorites(prev => prev.filter(f => f.id !== id));
    };

    const handleEdit = (favorite) => {
        setSelected(favorite);
        setShowModal(true);
    };

    const handleAdd = () => {
        setSelected(null);
        setShowModal(true);
    };

    const handleSave = (data) => {
        if (selected) {
            // Editar alias
            setFavorites(prev => prev.map(f => f.id === selected.id ? { ...f, alias: data.alias } : f));
        } else {
            // Agregar nuevo
            const newFav = {
                id: Date.now(),
                usuario_id: 1,
                numero_cuenta_favorito: data.numero_cuenta_favorito,
                alias: data.alias,
            };
            setFavorites(prev => [...prev, newFav]);
        }
        setShowModal(false);
        setSelected(null);
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
                <div>
                    <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Favoritos</h1>
                    <p className="text-slate-500 text-[13px]">Gestiona tus cuentas favoritas para transferencias rápidas</p>
                </div>
                <button onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-[#030712] transition-all active:scale-[0.98] flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
                    <Plus className="w-4 h-4" />
                    Agregar favorito
                </button>
            </div>

            {/* RESUMEN */}
            <div className="rounded-2xl p-5 mb-6 flex items-center gap-4"
                style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(13,148,136,0.05) 100%)", border: "1px solid rgba(16,185,129,0.15)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <Star className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <p className="text-white font-bold text-[16px]">{favorites.length} favorito{favorites.length !== 1 ? "s" : ""}</p>
                    <p className="text-slate-500 text-[12px]">Cuentas guardadas para transferencias</p>
                </div>
            </div>

            {/* BUSCADOR */}
            <div className="relative mb-5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                    type="text"
                    placeholder="Buscar por alias o número de cuenta..."
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

                {filtered.length === 0 ? (
                    <div className="text-center py-14">
                        <Star className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                        <p className="text-slate-600 text-[13px]">No se encontraron favoritos.</p>
                    </div>
                ) : (
                    <div className="divide-y" style={{ borderColor: "rgba(30,41,59,0.5)" }}>
                        {filtered.map(fav => (
                            <div key={fav.id}
                                className="flex items-center justify-between px-5 py-4 hover:bg-slate-800/20 transition-all gap-4">

                                {/* Avatar + info */}
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-[14px]"
                                        style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)", boxShadow: "0 4px 12px rgba(16,185,129,0.2)" }}>
                                        {fav.alias[0].toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-[14px] font-semibold truncate">{fav.alias}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <User className="w-3 h-3 text-slate-600 flex-shrink-0" />
                                            <p className="text-slate-500 text-[11px] font-mono truncate">
                                                **** **** {fav.numero_cuenta_favorito.slice(-4)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => handleEdit(fav)}
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-all"
                                        style={{ background: "rgba(30,41,59,0.4)" }}>
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => handleDelete(fav.id)}
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-400 transition-all"
                                        style={{ background: "rgba(30,41,59,0.4)" }}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <FavoriteModal
                    isOpen={showModal}
                    onClose={() => { setShowModal(false); setSelected(null); }}
                    favorite={selected}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};