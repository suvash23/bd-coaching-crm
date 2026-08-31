import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const SidebarLink = ({ href, active, children }) => (
    <Link
        href={href}
        className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${active
            ? 'bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-white border-r-4 border-blue-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
            }`}
    >
        {children}
    </Link>
);

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingMobileMenu, setShowingMobileMenu] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: route('dashboard'), active: route().current('dashboard') },
        { name: 'Schedule / Classes', href: '#', active: false },
        { name: 'Students', href: '#', active: false },
        { name: 'Courses', href: route('courses.index'), active: route().current('courses.*') },
        { name: 'Batches', href: route('batches.index'), active: route().current('batches.*') },
        { name: 'Fees & Collection', href: '#', active: false },
        { name: 'Broadcasts', href: '#', active: false },
        { name: 'Reports', href: '#', active: false },
        { name: 'Settings', href: '#', active: false },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed inset-y-0 z-10">
                <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800 px-4">
                    <Link href="/">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <SidebarLink key={item.name} href={item.href} active={item.active}>
                                {item.name}
                            </SidebarLink>
                        ))}
                    </div>
                </nav>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Top Nav */}
                <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 sticky top-0">
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setShowingMobileMenu(!showingMobileMenu)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:hover:bg-gray-800 dark:hover:text-gray-300 transition duration-150 ease-in-out"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showingMobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1" />

                    <div className="flex items-center space-x-4">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-white dark:bg-gray-900 px-3 py-2 text-sm font-medium leading-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
                                        {user.name}
                                        <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </nav>

                {/* Mobile Menu */}
                {showingMobileMenu && (
                    <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                        <div className="space-y-1 pb-3 pt-2">
                            {navItems.map((item) => (
                                <ResponsiveNavLink key={item.name} href={item.href} active={item.active}>
                                    {item.name}
                                </ResponsiveNavLink>
                            ))}
                        </div>
                    </div>
                )}

                {/* Page Header */}
                {header && (
                    <header className="bg-white dark:bg-gray-800 shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
