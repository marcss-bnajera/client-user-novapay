import { useState, useEffect } from "react";
import { ArrowRightLeft, TrendingUp, DollarSign, RefreshCw, Loader2 } from "lucide-react";
import { useAuthStore } from "../../auth/store/authStore";
import { useAccountsStore } from "../../accounts/store/accountsStore";
import { useCurrenciesStore } from "../store/currenciesStore";
import { showError } from "../../../shared/utils/toast";

const availableCurrencies = [
    { code: "USD", symbol: "$",  label: "Dólar estadounidense", flag: "🇺🇸" },
    { code: "EUR", symbol: "€",  label: "Euro",                 flag: "🇪🇺" },
    { code: "GBP", symbol: "£",  label: "Libra esterlina",      flag: "🇬🇧" },
    { code: "MXN", symbol: "$",  label: "Peso mexicano",        flag: "🇲🇽" },
];

const currencyColors = {
    USD: { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)"  },
    EUR: { color: "#6366f1", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.2)"  },
    GBP: { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.2)"  },
    MXN: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
};

const formatBalance = (amount, symbol = "") =>
    `${symbol}${Number(amount).toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const Currencies = () => {
    const { user } = useAuthStore();
    const { accounts, getMyAccounts } = useAccountsStore();
    const { result, loading, convertCurrency } = useCurrenciesStore();

    const [selectedAccount,  setSelectedAccount]  = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(availableCurrencies[0]);

    useEffect(() => {
        if (user?.id) {
            getMyAccounts(user.id).catch((err) => {
                showError(err?.response?.data?.message || "Error al cargar cuentas");
            });
        }
    }, [user?.id]);

    useEffect(() => {
        if (accounts.length > 0 && !selectedAccount) {
            setSelectedAccount(accounts[0]);
        }
    }, [accounts]);

    const handleConvert = async () => {
        if (!selectedAccount?.numero_cuenta) return;
        try {
            await convertCurrency(selectedAccount.numero_cuenta, selectedCurrency.code);
        } catch (err) {
            showError(err?.response?.data?.message || "Error al convertir divisa");
        }
    };

    const colorResult = result ? (currencyColors[result.moneda_destino] || currencyColors.USD) : null;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">

            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Divisas</h1>
                <p className="text-slate-500 text-[13px]">Consulta el valor de tu saldo en otras monedas</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* COLUMNA IZQUIERDA — Formulario */}
                <div className="flex flex-col gap-5">

                    {/* Selector de cuenta */}
                    <div className="rounded-2xl p-5"
                        style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">
                            Selecciona una cuenta
                        </p>
                        {accounts.length === 0 ? (
                            <p className="text-slate-600 text-[13px] text-center py-4">No tienes cuentas activas.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {accounts.map(account => {
                                    const isSelected = selectedAccount?.id === account.id;
                                    return (
                                        <button key={account.id}
                                            onClick={() => { setSelectedAccount(account); }}
                                            className="flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left"
                                            style={{
                                                background: isSelected ? "rgba(16,185,129,0.1)" : "rgba(4,8,16,0.5)",
                                                border: isSelected ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(30,41,59,0.8)",
                                            }}>
                                            <div>
                                                <p className="text-slate-200 text-[13px] font-medium">
                                                    {account.nombre_cuenta || account.tipo || "Cuenta"}
                                                </p>
                                                <p className="text-slate-500 text-[11px] font-mono">
                                                    **** {account.numero_cuenta?.slice(-4)}
                                                </p>
                                            </div>
                                            <p className="text-emerald-400 text-[13px] font-bold">
                                                {formatBalance(account.balance, "Q ")}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Selector de moneda destino */}
                    <div className="rounded-2xl p-5"
                        style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">
                            Moneda destino
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {availableCurrencies.map(currency => {
                                const isSelected = selectedCurrency.code === currency.code;
                                const c = currencyColors[currency.code] || currencyColors.USD;
                                return (
                                    <button key={currency.code}
                                        onClick={() => setSelectedCurrency(currency)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
                                        style={{
                                            background: isSelected ? c.bg : "rgba(4,8,16,0.5)",
                                            border: isSelected ? `1px solid ${c.border}` : "1px solid rgba(30,41,59,0.8)",
                                        }}>
                                        <span className="text-xl">{currency.flag}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-slate-200 text-[13px] font-medium">{currency.code}</p>
                                            <p className="text-slate-500 text-[10px] truncate">{currency.label}</p>
                                        </div>
                                        <span className="text-[11px] font-mono font-bold" style={{ color: c.color }}>
                                            {currency.symbol}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Botón convertir */}
                    <button onClick={handleConvert}
                        disabled={loading || !selectedAccount}
                        className="w-full py-3.5 rounded-xl font-bold text-[14px] text-[#030712] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)", boxShadow: "0 4px 20px rgba(16,185,129,0.25)" }}>
                        {loading
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Convirtiendo...</>
                            : <><ArrowRightLeft className="w-4 h-4" /> Convertir saldo</>
                        }
                    </button>
                </div>

                {/* COLUMNA DERECHA — Resultado */}
                <div className="flex flex-col gap-5">
                    <div className="rounded-2xl p-5 min-h-[180px] flex flex-col justify-center"
                        style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>

                        {!result && !loading && (
                            <div className="text-center py-6">
                                <ArrowRightLeft className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                                <p className="text-slate-600 text-[13px]">Selecciona una cuenta y moneda para convertir</p>
                            </div>
                        )}
                        {loading && (
                            <div className="text-center py-6">
                                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto mb-2" />
                                <p className="text-slate-500 text-[13px]">Calculando conversión...</p>
                            </div>
                        )}
                        {result && !loading && (
                            <div>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-5">
                                    Resultado de conversión
                                </p>

                                {/* Balance original */}
                                <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-3"
                                    style={{ background: "rgba(4,8,16,0.5)", border: "1px solid rgba(30,41,59,0.8)" }}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">🇬🇹</span>
                                        <div>
                                            <p className="text-slate-500 text-[10px] uppercase tracking-wider">Saldo original</p>
                                            <p className="text-slate-300 text-[12px] font-medium">
                                                {selectedAccount?.nombre_cuenta || "Cuenta"}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-white font-bold text-[15px]">{result.balance_quetzales}</p>
                                </div>

                                {/* Flecha */}
                                <div className="flex justify-center mb-3">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                                        style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                                        <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                                    </div>
                                </div>

                                {/* Balance convertido */}
                                <div className="flex items-center justify-between px-4 py-4 rounded-xl"
                                    style={{ background: colorResult.bg, border: `1px solid ${colorResult.border}` }}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{selectedCurrency.flag}</span>
                                        <div>
                                            <p className="text-slate-500 text-[10px] uppercase tracking-wider">Equivalente en</p>
                                            <p className="text-slate-300 text-[12px] font-medium">{selectedCurrency.label}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-[18px]" style={{ color: colorResult.color }}>
                                        {result.balance_convertido}
                                    </p>
                                </div>

                                {/* Tipo de cambio */}
                                <div className="flex items-center gap-1.5 mt-3 px-1">
                                    <TrendingUp className="w-3 h-3 text-slate-600" />
                                    <p className="text-slate-600 text-[11px]">
                                        1 GTQ = {result.tipo_cambio} {result.moneda_destino}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info de tasas */}
                    <div className="rounded-2xl p-5"
                        style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                                Monedas disponibles
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            {availableCurrencies.map(currency => {
                                const c = currencyColors[currency.code] || currencyColors.USD;
                                return (
                                    <div key={currency.code}
                                        className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                                        style={{ background: "rgba(4,8,16,0.5)", border: "1px solid rgba(30,41,59,0.6)" }}>
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-base">{currency.flag}</span>
                                            <div>
                                                <p className="text-slate-300 text-[12px] font-semibold">{currency.code}</p>
                                                <p className="text-slate-600 text-[10px]">{currency.label}</p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-mono font-bold" style={{ color: c.color }}>
                                            {currency.symbol}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
