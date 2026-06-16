import { useNavigate } from "react-router-dom";
import { LogOut, Bell } from "lucide-react";
import { useAuthStore } from "../../../features/auth/store/authStore";
import imgLogo from "../../../assets/img/logo_novapay_signo.png";

export const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const initials = user
        ? `${user.nombre?.[0] || ""}${user.apellido?.[0] || ""}`.toUpperCase()
        : "?";

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#060a10] via-[#0a1628] to-[#060a10] border-b border-emerald-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <div className="max-w-full mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

                {/* Logo y Nombre */}
                <div className="flex items-center gap-2 md:gap-3 pl-14 md:pl-0 transition-all">
                    <img
                        src={imgLogo}
                        alt="NovaPay Logo"
                        className="h-7 md:h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                    />

                    <div className="flex flex-col border-l border-slate-700/50 pl-2 md:pl-3">
                        <span className="text-white font-black text-sm md:text-base tracking-tighter leading-none">
                            NOVA<span className="text-emerald-400">PAY</span>
                        </span>
                        <span className="hidden sm:inline-block text-emerald-500/70 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">
                            Mi cuenta
                        </span>
                    </div>
                </div>

                {/* Notificaciones y Perfil */}
                <div className="flex items-center gap-2 md:gap-3">

                    {/* Notificaciones */}
                    <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 border border-slate-700/60 transition-all">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </button>

                    <div className="h-6 w-px bg-slate-700/50" />

                    {/* Avatar con iniciales */}
                    <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-[12px] font-bold bg-gradient-to-br from-[#10b981] to-[#0d9488] shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                        {initials}
                    </div>

                    {/* Cerrar sesión */}
                    <button
                        onClick={handleLogout}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-slate-800/60 border border-slate-700/60 transition-all"
                        title="Cerrar sesión"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
