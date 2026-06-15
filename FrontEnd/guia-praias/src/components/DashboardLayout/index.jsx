import Sidebar from "../Sidebar";

export default function DashboardLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-[#020b18] text-white">
            <Sidebar />

            <main className="ml-64 min-h-screen px-10 py-10">
                {title && (
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold">{title}</h1>
                        {subtitle && (
                            <p className="text-gray-400 mt-2">{subtitle}</p>
                        )}
                    </div>
                )}

                {children}
            </main>
        </div>
    );
}
