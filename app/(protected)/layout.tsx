import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}
export default function ProtectedLayout ({children}: ProtectedLayoutProps) {
    return(
        <div className="h-full w-full bg-gray-800">
            <div className="px-4 py-5 flex justify-center">
                <Navbar />
            </div>
            <div className="flex flex-col gap-y-10 px-4 items-center">
                {children}
            </div>
        </div>
    )
}
