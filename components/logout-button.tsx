'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button'; // A button component from your UI library
import { LogOut } from 'lucide-react'; // An icon for the button

/**
 * A client component that renders a logout button.
 * When clicked, it calls the logout API endpoint and redirects the user.
 */
export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Call the API endpoint we just created.
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            if (response.ok) {
                // If the server successfully clears the cookie,
                // redirect the user to the login page.
                router.push('/login');
            } else {
                // If something goes wrong on the server, log the error.
                console.error('Logout failed:', await response.text());
                // You could also show a notification to the user here.
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    return (
        <form action={handleLogout}>
            <Button variant="ghost" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
            </Button>
        </form>
    );
}
