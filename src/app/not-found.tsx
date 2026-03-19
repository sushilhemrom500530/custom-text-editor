export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 relative overflow-hidden">
            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-12">
                <div className="text-center space-y-4">
                    <h1
                        className="text-5xl font-black tracking-tight text-white"
                        style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" }}
                    >
                        404 - Not Found
                    </h1>
                </div>
            </div>
        </div>
    );
}