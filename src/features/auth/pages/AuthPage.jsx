import { useState } from "react";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { LoginForm } from "../components/LoginForm";

export const AuthPage = () => {
  const [isForgot, setIsForgot] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Contenedor principal: ocupa toda la pantalla y centra el contenido */}

      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-10">
        {/* Tarjeta blanca: caja central con sombra, borde y padding */}

        <div className="text-center mb-6">
          {/* Contenedor del texto: título y descripción centrados */}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {/* Título dinámico según estado */}
            {isForgot
              ? "Recuperar Contraseña"
              : isLogin
                ? "Bienvenido de Nuevo"
                : "Crear Cuenta"}
          </h1>

          <p className="text-gray-600 text-base max-w-md mx-auto">
            {/* Descripción debajo del título */}
            {isForgot
              ? "Ingresa tu correo para recuperar tu contraseña"
              : isLogin
                ? "Ingresa a tu cuenta de usuario de NovaPay"
                : "Regístrate como usuario de NovaPay"}
          </p>
        </div>
        {isForgot ? (
          <ForgotPasswordForm
            onSwitch={() => {
              setIsForgot(false);
            }}
          />
        ) : (
          <LoginForm 
            isLogin={isLogin} 
            setIsLogin={setIsLogin} 
            onForgot={() => setIsForgot(true)} 
          />
        )}
      </div> 
      {/* Cierre de la tarjeta blanca */}
    </div>
  );
};