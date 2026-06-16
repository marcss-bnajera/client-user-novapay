import { useState, useEffect } from "react";
import { X, Star, User, Hash, Check, Loader2 } from "lucide-react";

const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200";
const inputStyle = { background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.9)" };

export const FavoriteModal = ({ isOpen, onClose, favorite, onSave }) => {
    const isEditing = !!favorite;
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        numero_cuenta_favorito: "",
        alias: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setFormData({
                numero_cuenta_favorito: favorite?.numero_cuenta_favorito || "",
                alias: favorite?.alias || "",
            });
            setErrors({});
        }
    }, [isOpen, favorite]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({ ...prev, [name]: "" }));

        let sanitized = value;
        if (name === "numero_cuenta_favorito") {
            sanitized = value.replace(/[^0-9]/g, "").slice(0, 12);
        }
        setFormData((prev) => ({ ...prev, [name]: sanitized }));
    };

    const validate = () => {
        const newErrors = {};
        if (!isEditing) {
            if (!formData.numero_cuenta_favorito.trim()) {
                newErrors.numero_cuenta_favorito = "El número de cuenta es obligatorio";
            } else if (!/^\d{12}$/.test(formData.numero_cuenta_favorito)) {
                newErrors.numero_cuenta_favorito = "Debe ser exactamente 12 dígitos numéricos";
            }
        }
        if (!formData.alias.trim()) {
            newErrors.alias = "El alias es obligatorio";
        } else if (formData.alias.trim().length < 2 || formData.alias.trim().length > 50) {
            newErrors.alias = "El alias debe tener entre 2 y 50 caracteres";
        }
        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            await onSave(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>

            <div className="w-full max-w-md rounded-2xl overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(7,12,20,0.98) 0%, rgba(10,22,40,0.98) 100%)",
                    border: "1px solid rgba(16,185,129,0.15)",
                    boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
                }}>

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5"
                    style={{ borderBottom: "1px solid rgba(30,41,59,0.7)" }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
                            <Star className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-[15px]">
                                {isEditing ? "Editar favorito" : "Agregar favorito"}
                            </h2>
                            <p className="text-slate-500 text-[11px]">
                                {isEditing ? "Cambia el alias del favorito" : "Guarda una cuenta como favorita"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all"
                        style={{ background: "rgba(30,41,59,0.5)" }}>
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* FORMULARIO */}
                <div className="px-6 py-5 flex flex-col gap-4">

                    {/* Número de cuenta — solo al agregar */}
                    {!isEditing && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.15em]">
                                Número de cuenta
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors">
                                    <Hash className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    name="numero_cuenta_favorito"
                                    value={formData.numero_cuenta_favorito}
                                    onChange={handleChange}
                                    placeholder="Ej. 480123456789"
                                    maxLength={12}
                                    className={inputClass}
                                    style={{ ...inputStyle, ...(errors.numero_cuenta_favorito ? { borderColor: "rgba(239,68,68,0.5)" } : {}) }}
                                    onFocus={(e) => !errors.numero_cuenta_favorito && (e.target.style.borderColor = "rgba(16,185,129,0.4)")}
                                    onBlur={(e) => !errors.numero_cuenta_favorito && (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                                />
                            </div>
                            {errors.numero_cuenta_favorito && (
                                <p className="text-red-400 text-[11px] ml-1">{errors.numero_cuenta_favorito}</p>
                            )}
                        </div>
                    )}

                    {/* Número de cuenta solo lectura al editar */}
                    {isEditing && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em]">
                                Número de cuenta
                            </label>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                style={{ background: "rgba(4,8,16,0.4)", border: "1px solid rgba(30,41,59,0.6)" }}>
                                <Hash className="w-4 h-4 text-slate-700" />
                                <span className="text-slate-500 text-[13px] font-mono">
                                    **** **** {favorite.numero_cuenta_favorito.slice(-4)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Alias */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.15em]">
                            Alias
                        </label>
                        <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors">
                                <User className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                name="alias"
                                value={formData.alias}
                                onChange={handleChange}
                                placeholder="Ej. Mamá, Juan del trabajo..."
                                className={inputClass}
                                style={{ ...inputStyle, ...(errors.alias ? { borderColor: "rgba(239,68,68,0.5)" } : {}) }}
                                onFocus={(e) => !errors.alias && (e.target.style.borderColor = "rgba(16,185,129,0.4)")}
                                onBlur={(e) => !errors.alias && (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                            />
                        </div>
                        {errors.alias && <p className="text-red-400 text-[11px] ml-1">{errors.alias}</p>}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="px-6 py-4 flex justify-end gap-3"
                    style={{ borderTop: "1px solid rgba(30,41,59,0.7)" }}>
                    <button onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-slate-400 hover:text-white transition-all"
                        style={{ background: "rgba(30,41,59,0.5)", border: "1px solid rgba(30,41,59,0.8)" }}>
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-[#030712] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        {isEditing ? "Guardar alias" : "Agregar favorito"}
                    </button>
                </div>
            </div>
        </div>
    );
};
