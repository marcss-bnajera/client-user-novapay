import { axiosUser } from "./api";

// ==================== USERS ====================
export const getProfile = async (id) => {
    return await axiosUser.get(`/users/${id}`);
};

export const updateProfile = async (id, data) => {
    return await axiosUser.put(`/users/${id}`, data);
};

// ==================== ACCOUNTS ====================
export const getMyAccounts = async (usuario_id) => {
    return await axiosUser.get(`/accounts/${usuario_id}`);
};

// ==================== CARDS ====================
export const getCardsByAccount = async (accountId) => {
    return await axiosUser.get(`/cards/account/${accountId}`);
};

// ==================== DEPOSITS ====================
export const getDepositById = async (id) => {
    return await axiosUser.get(`/deposits/${id}`);
};

export const createDeposit = async (data) => {
    return await axiosUser.post("/deposits", data);
};

// ==================== PRODUCTS ====================
export const getProducts = async () => {
    return await axiosUser.get("/products");
};

export const getProductById = async (id) => {
    return await axiosUser.get(`/products/${id}`);
};

// ==================== TRANSFERS ====================
export const makeTransfer = async (data) => {
    return await axiosUser.post("/transfers", data);
};

// ==================== TRANSACTIONS ====================
export const getMyTransactions = async (id) => {
    return await axiosUser.get(`/transactions/${id}`);
};

// ==================== SHOPPINGS ====================
export const getShoppingsByCuenta = async (cuenta_id) => {
    return await axiosUser.get(`/shoppings?cuenta_id=${cuenta_id}`);
};

export const getShoppingById = async (id) => {
    return await axiosUser.get(`/shoppings/${id}`);
};

export const createShopping = async (data) => {
    return await axiosUser.post("/shoppings", data);
};

// ==================== PASSBOOKS ====================
export const getPassbookByAccount = async (accountId) => {
    return await axiosUser.get(`/passbooks/account/${accountId}`);
};

// ==================== FAVORITES ====================
export const addFavorite = async (data) => {
    return await axiosUser.post("/favorites/add", data);
};

export const getFavorites = async (usuario_id) => {
    return await axiosUser.get(`/favorites/${usuario_id}`);
};

export const updateFavoriteAlias = async (id, data) => {
    return await axiosUser.put(`/favorites/${id}`, data);
};

export const removeFavorite = async (id) => {
    return await axiosUser.delete(`/favorites/${id}`);
};

// ==================== CURRENCIES ====================
export const convertCurrency = async (numeroCuenta, to = "USD") => {
    return await axiosUser.get(`/currencies/convert/${numeroCuenta}?to=${to}`);
};
