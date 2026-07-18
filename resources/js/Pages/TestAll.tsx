type DatabaseInfo = {
    status: string;
    name?: string;
    version?: string;
    usersTable?: boolean;
    sessionsTable?: boolean;
    error?: string;
};

type Props = {
    laravel: string;
    php: string;
    database: DatabaseInfo;
};

export default function TestAll({ laravel, php, database }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-10">
            <div className="mx-auto max-w-4xl space-y-8">

                {/* Header */}
                <div className="rounded-2xl bg-white p-8 shadow-2xl">
                    <h1 className="text-4xl font-extrabold text-blue-600">
                        🚀 Laravel Stack Test
                    </h1>

                    <p className="mt-2 text-gray-600">
                        If this page looks polished, Tailwind is working.
                    </p>
                </div>

                {/* Stack Tests */}
                <div className="grid gap-4 md:grid-cols-2">

                    <div className="rounded-xl bg-green-100 p-6 shadow">
                        <h2 className="font-bold text-green-700">
                            Backend
                        </h2>

                        <ul className="mt-3 space-y-2">
                            <li>✅ Laravel {laravel}</li>
                            <li>✅ PHP {php}</li>
                        </ul>
                    </div>

                    <div className="rounded-xl bg-blue-100 p-6 shadow">
                        <h2 className="font-bold text-blue-700">
                            Frontend
                        </h2>

                        <ul className="mt-3 space-y-2">
                            <li>✅ React</li>
                            <li>✅ TypeScript</li>
                            <li>✅ Inertia</li>
                            <li>✅ Tailwind</li>
                        </ul>
                    </div>

                </div>

                {/* Database */}
                <div className="rounded-xl bg-white p-6 shadow-xl">
                    <h2 className="mb-4 text-2xl font-bold">
                        Database Test
                    </h2>

                    {database.status === "Connected" ? (
                        <div className="space-y-2">
                            <p className="text-green-600 font-semibold">
                                ✅ Connected
                            </p>

                            <p>Database: {database.name}</p>

                            <p>MySQL: {database.version}</p>

                            <p>
                                Users Table:{" "}
                                {database.usersTable ? "✅" : "❌"}
                            </p>

                            <p>
                                Sessions Table:{" "}
                                {database.sessionsTable ? "✅" : "❌"}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded bg-red-100 p-4 text-red-700">
                            <strong>Connection Failed</strong>

                            <pre className="mt-2 overflow-auto whitespace-pre-wrap">
                                {database.error}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Tailwind Demo */}
                <div className="rounded-xl bg-white p-6 shadow-xl">
                    <h2 className="mb-4 text-2xl font-bold">
                        Tailwind Test
                    </h2>

                    <div className="flex flex-wrap gap-4">

                        <button className="rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:scale-105 hover:bg-blue-700">
                            Hover Me
                        </button>

                        <button className="rounded-lg bg-emerald-600 px-5 py-3 text-white transition hover:rotate-2">
                            Animation
                        </button>

                        <button className="rounded-lg border border-purple-600 px-5 py-3 text-purple-600 hover:bg-purple-600 hover:text-white">
                            Border
                        </button>

                    </div>

                    <div className="mt-6 grid grid-cols-4 gap-3">
                        <div className="h-16 rounded bg-red-500"></div>
                        <div className="h-16 rounded bg-yellow-500"></div>
                        <div className="h-16 rounded bg-green-500"></div>
                        <div className="h-16 rounded bg-blue-500"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}