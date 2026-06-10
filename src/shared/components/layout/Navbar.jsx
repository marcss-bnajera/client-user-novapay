import imgLogo from "../../../assets/img/logo_novapay_signo.png";
import { Bell } from "lucide-react";

export const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 border-b border-emerald-500/20"
            style={{ background: "linear-gradient(90deg, #060a10 0%, #0a1628 50%, #060a10 100%)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
            <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img src={imgLogo} alt="NovaPay Logo" className="h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
                    <div className="flex flex-col border-l border-slate-700/50 pl-3">
                        <span className="text-white font-black text-base tracking-tighter leading-none">
                            NOVA<span className="text-emerald-400">PAY</span>
                        </span>
                        <span className="text-emerald-500/70 text-[9px] font-bold uppercase tracking-[0.2em]">
                            Mi cuenta
                        </span>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    {/* Notificaciones */}
                    <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 transition-all"
                        style={{ border: "1px solid rgba(30,41,59,0.6)" }}>
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </button>

                    <div className="h-6 w-px bg-slate-700/50" />

                    {/* Avatar placeholder */}
                    <div className="w-9 h-9 rounded-xl flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)", boxShadow: "0 0 12px rgba(16,185,129,0.3)" }} />
                </div>
            </div>
        </nav>
    );
};