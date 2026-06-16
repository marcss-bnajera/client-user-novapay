import { useState } from "react";
import { X, User, Mail, Phone, Briefcase, MapPin, Lock, Eye, EyeOff, Check, DollarSign, Loader2 } from "lucide-react";
import { useAuthStore } from "../../auth/store/authStore";
import { useUsersStore } from "../store/usersStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

const allowOnlyLetters = (value) => value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "");

const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200";
const inputStyle = { background: "rgba(4,8,16,0.6)", border: "1px solid rgba(30,41,59,0.9)" };

const Field = ({ icon: Icon, label, name, type = "text", placeholder, value, onChange, error, showPassword, onTogglePassword }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.15em]">
            {label}
        </label>
        <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors">
                <Icon className="w-4 h-4" />
            </div>
            <input
                type={name === "password" ? (showPassword ? "text" : "password") : type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClass}
                style={{ ...inputStyle, ...(error ? { borderColor: "rgba(239,68,68,0.5)" } : {}) }}
                onFocus={(e) => !error && (e.target.style.borderColor = "rgba(16,185,129,0.4)")}
                onBlur={(e) => !error && (e.target.style.borderColor = "rgba(30,41,59,0.9)")}
            />
            {name === "password" && (
                <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-400 transition-colors"
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            )}
        </div>
        {error && <p className="text-red-400 text-[11px] ml-1">{error}</p>}
    </div>
);

export const UserModal = ({ isOpen, onClose, user }) => {
    const { user: authUser } = useAuthStore();
    const { updateProfile, loading } = useUsersStore();

    const [formData, setFormData] = useState({
        nombre: user?.nombre || "",
        apellido: user?.apellido || "",
        email: user?.email || "",
        telefono: user?.telefono || "",
        direccion: user?.direccion || "",
        nombre_trabajo: user?.nombre_trabajo || "",
        ingresos_mensuales: user?.ingresos_mensuales || "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
        else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(formData.nombre)) newErrors.nombre = "Solo se permiten letras";

        if (!formData.apellido.trim()) newErrors.apellido = "El apellido es obligatorio";
        else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(formData.apellido)) newErrors.apellido = "Solo se permiten letras";

        if (!formData.email.trim()) newErrors.email = "El correo es obligatorio";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Correo inválido";

        if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio";
        else if (!/^\d{8}$/.test(formData.telefono)) newErrors.telefono = "El teléfono debe tener 8 dígitos";

        if (!formData.direccion.trim()) newErrors.direccion = "La dirección es obligatoria";

        if (!formData.nombre_trabajo.trim()) newErrors.nombre_trabajo = "El lugar de trabajo es obligatorio";

        if (!formData.ingresos_mensuales) newErrors.ingresos_mensuales = "Los ingresos son obligatorios";
        else if (isNaN(formData.ingresos_mensuales) || Number(formData.ingresos_mensuales) <= 0)
            newErrors.ingresos_mensuales = "Ingresa un monto válido";

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({ ...prev, [name]: "" }));

        let sanitized = value;
        if (name === "nombre" || name === "apellido" || name === "nombre_trabajo") {
            sanitized = allowOnlyLetters(value);
        }
        if (name === "telefono") {
            sanitized = value.replace(/[^0-9]/g, "").slice(0, 8);
        }
        if (name === "ingresos_mensuales") {
            sanitized = value.replace(/[^0-9.]/g, "");
        }
        setFormData((prev) => ({ ...prev, [name]: sanitized }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const payload = { ...formData };
        if (!payload.password) delete payload.password;

        try {
            await updateProfile(authUser.id, payload);
            showSuccess("Perfil actualizado correctamente");
            onClose();
        } catch (err) {
            showError(err?.response?.data?.message || "Error al actualizar perfil");
        }
    };

    if (!isOpen) return null;

    const fieldProps = {
        onChange: handleChange,
        showPassword,
        onTogglePassword: () => setShowPassword((p) => !p),
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>

            <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(7,12,20,0.98) 0%, rgba(10,22,40,0.98) 100%)",
                    border: "1px solid rgba(16,185,129,0.15)",
                    boxShadow: "0 32px 64px rgba(0,0,0,0.6)"
                }}>

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5"
                    style={{ borderBottom: "1px solid rgba(30,41,59,0.7)" }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
                            <User className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-[15px]">Editar perfil</h2>
                            <p className="text-slate-500 text-[11px]">Actualiza tu información personal</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all"
                        style={{ background: "rgba(30,41,59,0.5)" }}>
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                        Información personal
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field icon={User}  label="Nombre"   name="nombre"   placeholder="Tu nombre"          value={formData.nombre}   error={errors.nombre}   {...fieldProps} />
                        <Field icon={User}  label="Apellido" name="apellido" placeholder="Tu apellido"        value={formData.apellido} error={errors.apellido} {...fieldProps} />
                        <Field icon={Mail}  label="Correo"   name="email"    placeholder="correo@ejemplo.com" value={formData.email}    error={errors.email}   type="email"    {...fieldProps} />
                        <Field icon={Phone} label="Teléfono" name="telefono" placeholder="55551234"           value={formData.telefono} error={errors.telefono} {...fieldProps} />
                        <div className="sm:col-span-2">
                            <Field icon={MapPin} label="Dirección" name="direccion" placeholder="Tu dirección" value={formData.direccion} error={errors.direccion} {...fieldProps} />
                        </div>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(30,41,59,0.6)" }} />

                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                        Información laboral
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field icon={Briefcase}  label="Lugar de trabajo"   name="nombre_trabajo"     placeholder="Empresa o trabajo" value={formData.nombre_trabajo}     error={errors.nombre_trabajo}     {...fieldProps} />
                        <Field icon={DollarSign} label="Ingresos mensuales" name="ingresos_mensuales" placeholder="0.00"              value={formData.ingresos_mensuales} error={errors.ingresos_mensuales} type="text"    {...fieldProps} />
                    </div>

                    <div style={{ borderTop: "1px solid rgba(30,41,59,0.6)" }} />

                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Seguridad</p>
                    <p className="text-[11px] text-slate-700 -mt-2">Déjala en blanco si no deseas cambiarla.</p>
                    <Field icon={Lock} label="Nueva contraseña" name="password" placeholder="••••••••" value={formData.password} {...fieldProps} />

                    {/* FOOTER dentro del form */}
                    <div className="pt-2 flex justify-end gap-3"
                        style={{ borderTop: "1px solid rgba(30,41,59,0.7)" }}>
                        <button type="button" onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-slate-400 hover:text-white transition-all"
                            style={{ background: "rgba(30,41,59,0.5)", border: "1px solid rgba(30,41,59,0.8)" }}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-[#030712] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
