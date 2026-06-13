import { useState } from "react";
import { ArrowRightLeft, TrendingUp, DollarSign, RefreshCw } from "lucide-react";

const mockAccounts = [
    { id: 1, nombre_cuenta: "Cuenta Principal",   numero_cuenta: "480123456789", balance: 12850.75 },
    { id: 2, nombre_cuenta: "Cuenta de Ahorros",  numero_cuenta: "480987654321", balance: 45200.00 },
];

const mockCurrencies = [
    { id: 1, currency: "USD", symbol: "$",  rate: 0.1290, label: "Dólar estadounidense",  flag: "🇺🇸" },
    { id: 2, currency: "EUR", symbol: "€",  rate: 0.1185, label: "Euro",                  flag: "🇪🇺" },
    { id: 3, currency: "GBP", symbol: "£",  rate: 0.1015, label: "Libra esterlina",       flag: "🇬🇧" },
    { id: 4, currency: "MXN", symbol: "$",  rate: 2.1800, label: "Peso mexicano",         flag: "🇲🇽" },
    { id: 5, currency: "GTQ", symbol: "Q",  rate: 1.0000, label: "Quetzal guatemalteco",  flag: "🇬🇹" },
];

const currencyColors = {
    USD: { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)"  },
    EUR: { color: "#6366f1", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.2)"  },
    GBP: { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.2)"  },
    MXN: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
    GTQ: { color: "#38bdf8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.2)"  },
};

const formatBalance = (amount, symbol = "") =>
    `${symbol}${Number(amount).toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const Currencies = () => {
    const [selectedAccount, setSelectedAccount] = useState(mockAccounts[0]);
    const [selectedCurrency, setSelectedCurrency] = useState(mockCurrencies[0]);
    const [converting, setConverting] = useState(false);
    const [result, setResult] = useState(null);

    const handleConvert = () => {
        setConverting(true);
        setResult(null);
        // Simula delay de API
        setTimeout(() => {
            const converted = selectedAccount.balance * selectedCurrency.rate;
            setResult({
                balance_quetzales: selectedAccount.balance,
                moneda_destino: selectedCurrency.currency,
                tipo_cambio: selectedCurrency.rate,
                balance_convertido: converted,
                symbol: selectedCurrency.symbol,
            });
            setConverting(false);
        }, 800);
    };

    const colorResult = result ? (currencyColors[result.moneda_destino] || currencyColors.USD) : null;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">

            {/* HEADER */}
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
                        <div className="flex flex-col gap-2">
                            {mockAccounts.map(account => {
                                const isSelected = selectedAccount.id === account.id;
                                return (
                                    <button key={account.id}
                                        onClick={() => { setSelectedAccount(account); setResult(null); }}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left"
                                        style={{
                                            background: isSelected ? "rgba(16,185,129,0.1)" : "rgba(4,8,16,0.5)",
                                            border: isSelected ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(30,41,59,0.8)",
                                        }}>
                                        <div>
                                            <p className="text-slate-200 text-[13px] font-medium">{account.nombre_cuenta}</p>
                                            <p className="text-slate-500 text-[11px] font-mono">**** {account.numero_cuenta.slice(-4)}</p>
                                        </div>
                                        <p className="text-emerald-400 text-[13px] font-bold">
                                            {formatBalance(account.balance, "Q ")}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selector de moneda destino */}
                    <div className="rounded-2xl p-5"
                        style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">
                            Moneda destino
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mockCurrencies.map(currency => {
                                const isSelected = selectedCurrency.id === currency.id;
                                const c = currencyColors[currency.currency] || currencyColors.USD;
                                return (
                                    <button key={currency.id}
                                        onClick={() => { setSelectedCurrency(currency); setResult(null); }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
                                        style={{
                                            background: isSelected ? c.bg : "rgba(4,8,16,0.5)",
                                            border: isSelected ? `1px solid ${c.border}` : "1px solid rgba(30,41,59,0.8)",
                                        }}>
                                        <span className="text-xl">{currency.flag}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-slate-200 text-[13px] font-medium">{currency.currency}</p>
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
                    <button onClick={handleConvert} disabled={converting}
                        className="w-full py-3.5 rounded-xl font-bold text-[14px] text-[#030712] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
                        style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)", boxShadow: "0 4px 20px rgba(16,185,129,0.25)" }}>
                        {converting
                            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Convirtiendo...</>
                            : <><ArrowRightLeft className="w-4 h-4" /> Convertir saldo</>
                        }
                    </button>
                </div>

                {/* COLUMNA DERECHA — Resultado + tabla de tasas */}
                <div className="flex flex-col gap-5">

                    {/* Resultado de conversión */}
                    <div className="rounded-2xl p-5 min-h-[180px] flex flex-col justify-center"
                        style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                        {!result && !converting && (
                            <div className="text-center py-6">
                                <ArrowRightLeft className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                                <p className="text-slate-600 text-[13px]">Selecciona una cuenta y moneda para convertir</p>
                            </div>
                        )}
                        {converting && (
                            <div className="text-center py-6">
                                <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin mx-auto mb-2" />
                                <p className="text-slate-500 text-[13px]">Calculando conversión...</p>
                            </div>
                        )}
                        {result && !converting && (
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
                                            <p className="text-slate-300 text-[12px] font-medium">{selectedAccount.nombre_cuenta}</p>
                                        </div>
                                    </div>
                                    <p className="text-white font-bold text-[15px]">
                                        {formatBalance(result.balance_quetzales, "Q ")}
                                    </p>
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
                                        {formatBalance(result.balance_convertido, `${result.symbol} `)}
                                    </p>
                                </div>

                                {/* Tipo de cambio */}
                                <div className="flex items-center gap-1.5 mt-3 px-1">
                                    <TrendingUp className="w-3 h-3 text-slate-600" />
                                    <p className="text-slate-600 text-[11px]">
                                        1 GTQ = {result.tipo_cambio.toFixed(4)} {result.moneda_destino}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabla de tasas de cambio */}
                    <div className="rounded-2xl p-5"
                        style={{ background: "rgba(7,12,20,0.8)", border: "1px solid rgba(16,185,129,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                                Tasas de cambio (GTQ)
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            {mockCurrencies.map(currency => {
                                const c = currencyColors[currency.currency] || currencyColors.USD;
                                return (
                                    <div key={currency.id}
                                        className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                                        style={{ background: "rgba(4,8,16,0.5)", border: "1px solid rgba(30,41,59,0.6)" }}>
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-base">{currency.flag}</span>
                                            <div>
                                                <p className="text-slate-300 text-[12px] font-semibold">{currency.currency}</p>
                                                <p className="text-slate-600 text-[10px]">{currency.label}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[12px] font-bold font-mono" style={{ color: c.color }}>
                                                {currency.symbol}{currency.rate.toFixed(4)}
                                            </p>
                                            <p className="text-slate-600 text-[10px]">por Q1.00</p>
                                        </div>
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