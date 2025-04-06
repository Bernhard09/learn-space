export default function Page() {
    return (
        <main className="flex flex-col items-center gap-4">
            <h1 className="text-3xl font-bold mb-4">Forums</h1>
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Course Name</h2>
                <p className="text-gray-500">Description of the course goes here.</p>
            </div>
        </main>
    );
}