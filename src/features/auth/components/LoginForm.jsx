import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/authStore";

import imgUno from "../../../assets/img/carrusel_uno.png";
import imgDos from "../../../assets/img/carrusel_dos.png";
import imgTres from "../../../assets/img/carrusel_tres.png";

const carouselSlides = [
    { image: imgUno },
    { image: imgDos },
    { image: imgTres },
];

export const LoginForm = ({ onForgot }) => {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const [form, setForm] = useState({ EmailOrUsername: "", Password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrent((c) => {
                const next = (c + 1) % carouselSlides.length;
                setPrev(c);
                setTimeout(() => { setPrev(null); }, 800);
                return next;
            });
        }, 4500);
        return () => clearInterval(intervalRef.current);
    }, []);

    const handleChange = (e) => {
        setError("");
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.EmailOrUsername || !form.Password) {
            setError("Completa todos los campos");
            return;
        }
        setLoading(true);
        try {
            const result = await login(form);
            if (result?.success) {
                navigate("/dashboard");
            } else {
                setError(result?.error || "Credenciales incorrectas");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 overflow-hidden">
            <style>{`
                @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
                @keyframes formIn  { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
            `}</style>

            {/* FONDO CARRUSEL */}
            {prev !== null && (
                <div key={`prev-${prev}`} style={{ position: "absolute", inset: 0, zIndex: 0, animation: "fadeOut 0.8s ease forwards" }}>
                    <img src={carouselSlides[prev].image} alt="" className="w-full h-full object-cover" />
                </div>
            )}
            <div key={`curr-${current}`} style={{ position: "absolute", inset: 0, zIndex: 1, animation: "fadeIn 0.8s ease forwards" }}>
                <img src={carouselSlides[current].image} alt="" className="w-full h-full object-cover" />
            </div>

            {/* Overlay oscuro */}
            <div className="absolute inset-0 z-[2]"
                style={{ background: "linear-gradient(135deg, rgba(4,8,16,0.92) 0%, rgba(6,10,16,0.80) 50%, rgba(4,8,16,0.92) 100%)" }} />

            {/* Puntos decorativos */}
            <div className="absolute inset-0 z-[3] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(rgba(16,185,129,0.07) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

            {/* Glow central */}
            <div className="absolute z-[3] pointer-events-none"
                style={{ top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)" }} />

            {/* FORMULARIO CENTRADO */}
            <div className="absolute inset-0 z-[10] flex items-center justify-center px-4">
                <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400, background: "rgba(7,12,20,0.85)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 24, padding: "40px 36px", backdropFilter: "blur(24px)", boxShadow: "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.05), inset 0 1px 0 rgba(255,255,255,0.03)", animation: "formIn 0.6s ease both" }}>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-slate-50 text-[22px] font-bold tracking-tight mb-1">Bienvenido de vuelta</h1>
                        <p className="text-slate-500 text-[13px]">Accede a tu cuenta para continuar</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400"
                            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                            {error}
                        </div>
                    )}

                    {/* Campo usuario */}
                    <div className="mb-4">
                        <label className="block text-[10px] font-bold text-emerald-500 uppercase tracking-[0.15em] mb-2">
                            Email o usuario
                        </label>
                        <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors">
                                <User className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                name="EmailOrUsername"
                                value={form.EmailOrUsername}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com o usuario"
                                className="w-full pl-10 pr-4 py-3 text-[13px] rounded-xl text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200"
                                style={{ background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.9)" }}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(16,185,129,0.4)")}
                                onBlur={(e) => (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                            />
                        </div>
                    </div>

                    {/* Campo contraseña */}
                    <div className="mb-3">
                        <label className="block text-[10px] font-bold text-emerald-500 uppercase tracking-[0.15em] mb-2">
                            Contraseña
                        </label>
                        <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="Password"
                                value={form.Password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-3 text-[13px] rounded-xl text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200"
                                style={{ background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.9)" }}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(16,185,129,0.4)")}
                                onBlur={(e) => (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-400 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* ¿Olvidaste? */}
                    <div className="flex justify-center mb-6">
                        <button type="button" onClick={onForgot}
                            className="text-[12px] font-medium text-slate-500 hover:text-emerald-400 transition-colors">
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loading}
                        className="group w-full py-3 rounded-xl font-bold text-[13.5px] text-[#030712] flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)", boxShadow: "0 4px 20px rgba(16,185,129,0.25)" }}>
                        {loading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Iniciando sesión...</>
                        ) : (
                            <>Iniciar sesión <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>

                    {/* Indicadores carrusel */}
                    <div className="flex justify-center gap-1.5 mt-6">
                        {carouselSlides.map((_, i) => (
                            <div key={i} style={{
                                width: i === current ? 20 : 6, height: 3, borderRadius: 99,
                                background: i === current ? "#10b981" : "rgba(255,255,255,0.15)",
                                transition: "all 0.4s ease",
                            }} />
                        ))}
                    </div>
                </form>
            </div>
        </div>
    );
};
