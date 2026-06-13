import { Routes, Route } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { DashboardPage } from "../layouts/DashboardPage.jsx";
import { Users } from "../../features/users/components/Users.jsx"
import { Accounts } from "../../features/accounts/components/Accounts.jsx";
import { Cards } from "../../features/cards/components/Cards.jsx";
import { Passbooks } from "../../features/passbooks/components/Passbooks.jsx";
import { Dashboard } from "../../features/dashboard/components/Dashboard.jsx";
import { Currencies } from "../../features/currencies/components/Currencies.jsx";
import { Deposits } from "../../features/deposits/components/Deposits.jsx";
import { Favorites } from "../../features/favorites/components/Favorites.jsx";
import { Products } from "../../features/products/components/Products.jsx";
import { Shoppings } from "../../features/shoppings/components/Shoppings.jsx";
import { Transactions } from "../../features/transactions/components/Transactions.jsx";
import { Transfers } from "../../features/transfers/components/Transfers.jsx";

export const AppRoutes = ()=> {

    return(
        <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<AuthPage/>} />


            {/* PROTECTED + ROLE */}
            <Route
                path="/dashboard/*"
                element={<DashboardPage />}
            >
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="cards" element={<Cards />} />
                <Route path="passbooks" element={<Passbooks />} />
                <Route path="currencies" element={<Currencies />} />
                <Route path="deposits" element={<Deposits />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="products" element={<Products />} />
                <Route path="shoppings" element={<Shoppings />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="transfers" element={<Transfers />} />
            </Route>


            {/* Ruta temporal para pruebas */}
            <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
    );
}