import { Routes, Route } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { DashboardPage } from "../layouts/DashboardPage.jsx";
import { Users } from "../../features/users/components/Users.jsx"
import { Accounts } from "../../features/accounts/components/Accounts.jsx";
import { Cards } from "../../features/cards/components/Cards.jsx";
import { Passbooks } from "../../features/passbooks/components/Passbooks.jsx";
import { Dashboard } from "../../features/dashboard/components/Dashboard.jsx";

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
            </Route>


            {/* Ruta temporal para pruebas */}
            <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
    );
}