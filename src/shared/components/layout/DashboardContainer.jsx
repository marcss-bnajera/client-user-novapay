import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const DashboardContainer = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: "#060a10" }}>

            <Navbar />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 p-6 overflow-auto relative">
                    <div className="fixed inset-0 pointer-events-none z-0"
                        style={{ backgroundImage: "radial-gradient(rgba(16,185,129,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};