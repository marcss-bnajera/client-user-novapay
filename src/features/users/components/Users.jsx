import { useState } from "react";
import {
    User, Mail, Phone, MapPin, Briefcase,
    DollarSign, CreditCard, Shield, Calendar, Edit3
} from "lucide-react";
import { UserModal } from "./UserModal";

const mockUser = {
    nombre: "Carlos",
    apellido: "Mendoza",
    username: "cmendoza",
    email: "carlos.mendoza@gmail.com",
    dpi: "2891456230101",
    nit: "1234567-8",
    telefono: "55551234",
    direccion: "12 Calle 5-67, Zona 10, Ciudad de Guatemala",
    nombre_trabajo: "Desarrollador de Software",
    ingresos_mensuales: 18500.00,
    createdAt: "2024-03-15",
};

const InfoField = ({ icon: Icon, label, value }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.15em]">
            {label}
        </label>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.8)" }}>
            <Icon className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <span className="text-slate-400 text-[13px]">{value}</span>
        </div>
    </div>
);

const SectionTitle = ({ children, subtitle }) => (
    <div className="mb-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{children}</p>
        {subtitle && <p className="text-[11px] text-slate-700 mt-0.5">{subtitle}</p>}
    </div>
);

const Divider = () => (
    <div className="my-6" style={{ borderTop: "1px solid rgba(30,41,59,0.6)" }} />
);

export const Users = () => {
    const [showModal, setShowModal] = useState(false);

    const joinDate = new Date(mockUser.createdAt).toLocaleDateString("es-GT", {
        year: "numeric", month: "long", day: "numeric"
    });

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">

            {/* HEADER */}
            <div className="relative rounded-2xl overflow-hidden mb-6 p-6 flex items-center gap-6"
                style={{
                    background: "linear-gradient(135deg, rgba(7,12,20,0.95) 0%, rgba(10,22,40,0.95) 100%)",
                    border: "1px solid rgba(16,185,129,0.15)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
                }}>

                <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)" }} />

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                        style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)", boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}>
                        {mockUser.nombre[0]}{mockUser.apellido[0]}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2"
                        style={{ borderColor: "#070c14" }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h1 className="text-white text-xl font-bold tracking-tight">
                            {mockUser.nombre} {mockUser.apellido}
                        </h1>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}>
                            Activo
                        </span>
                    </div>
                    <p className="text-slate-500 text-[13px] mb-3">@{mockUser.username}</p>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Shield className="w-3 h-3 text-emerald-600" />
                            Cliente NovaPay
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Calendar className="w-3 h-3 text-emerald-600" />
                            Miembro desde {joinDate}
                        </div>
                    </div>
                </div>

                {/* Botón editar */}
                <button onClick={() => setShowModal(true)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
                    <Edit3 className="w-3.5 h-3.5" />
                    Editar perfil
                </button>
            </div>

            {/* CUERPO */}
            <div className="rounded-2xl p-6"
                style={{
                    background: "rgba(7,12,20,0.8)",
                    border: "1px solid rgba(16,185,129,0.1)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                }}>

                <SectionTitle>Información personal</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField icon={User}   label="Nombre"   value={mockUser.nombre} />
                    <InfoField icon={User}   label="Apellido" value={mockUser.apellido} />
                    <InfoField icon={Mail}   label="Correo"   value={mockUser.email} />
                    <InfoField icon={Phone}  label="Teléfono" value={mockUser.telefono} />
                    <div className="md:col-span-2">
                        <InfoField icon={MapPin} label="Dirección" value={mockUser.direccion} />
                    </div>
                </div>

                <Divider />

                <SectionTitle>Información laboral</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField icon={Briefcase}  label="Lugar de trabajo"   value={mockUser.nombre_trabajo} />
                    <InfoField icon={DollarSign} label="Ingresos mensuales" value={`Q ${Number(mockUser.ingresos_mensuales).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`} />
                </div>

                <Divider />

                <SectionTitle subtitle="Estos datos no pueden ser modificados.">
                    Datos de identificación
                </SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField icon={CreditCard} label="DPI"      value={mockUser.dpi} />
                    <InfoField icon={CreditCard} label="NIT"      value={mockUser.nit} />
                    <InfoField icon={User}       label="Username" value={mockUser.username} />
                </div>
            </div>

            {showModal && (
                <UserModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    user={mockUser}
                />
            )}
        </div>
    );
};