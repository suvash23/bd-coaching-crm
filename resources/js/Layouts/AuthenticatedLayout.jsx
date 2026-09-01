import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const NAV_ICONS = {
    'Dashboard': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>,
    'Schedule / Classes': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    'Students': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
    'Courses': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>,
    'Batches': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
    'Fees & Collection': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>,
    'Broadcasts': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>,
    'Reports': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
    'Settings': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
};

const SidebarLink = ({ href, active, icon, children }) => (
    <Link
        href={href}
        className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all mx-3 ${active
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
    >
        <span className={`flex-shrink-0 transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
            {icon}
        </span>
        {children}
    </Link>
);

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingMobileMenu, setShowingMobileMenu] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: route('dashboard'), active: route().current('dashboard') },
        { name: 'Schedule / Classes', href: route('classes.index'), active: route().current('classes.*') },
        { name: 'Students', href: route('students.index'), active: route().current('students.*') },
        { name: 'Courses', href: route('courses.index'), active: route().current('courses.*') },
        { name: 'Batches', href: route('batches.index'), active: route().current('batches.*') },
        { name: 'Fees & Collection', href: route('invoices.index'), active: route().current('invoices.*') },
        { name: 'Broadcasts', href: '#', active: false },
        { name: 'Reports', href: '#', active: false },
        { name: 'Settings', href: '#', active: false },
    ];

    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 fixed inset-y-0 z-10">
                {/* Logo */}
                <div className="flex items-center gap-3 h-16 px-6 border-b border-slate-800 flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <span className="text-base font-bold text-white tracking-tight">Coaching<span className="text-indigo-400">CRM</span></span>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                    {navItems.map((item) => (
                        <SidebarLink key={item.name} href={item.href} active={item.active} icon={NAV_ICONS[item.name]}>
                            {item.name}
                        </SidebarLink>
                    ))}
                </nav>

                {/* User card at bottom */}
                <div className="p-4 border-t border-slate-800 flex-shrink-0">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{user.name}</div>
                            <div className="text-xs text-slate-500 capitalize truncate">{user.role}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <nav className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setShowingMobileMenu(!showingMobileMenu)}
                        className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showingMobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                        </svg>
                    </button>

                    {/* Page header slot */}
                    <div className="flex-1 md:flex items-center hidden">
                        {header && <div className="text-slate-200 font-semibold">{header}</div>}
                    </div>

                    {/* Right side user menu */}
                    <div className="flex items-center gap-3 ml-auto">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
                                        {initials}
                                    </div>
                                    <span className="text-sm font-medium text-slate-200 hidden sm:block">{user.name}</span>
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </nav>

                {/* Mobile menu */}
                {showingMobileMenu && (
                    <div className="md:hidden bg-slate-900 border-b border-slate-800">
                        <div className="py-2 space-y-1">
                            {navItems.map((item) => (
                                <ResponsiveNavLink key={item.name} href={item.href} active={item.active}>
                                    {item.name}
                                </ResponsiveNavLink>
                            ))}
                        </div>
                    </div>
                )}

                {/* Page header on mobile */}
                {header && (
                    <header className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4">
                        {header}
                    </header>
                )}

                {/* Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-950">
                    {children}
                </main>
            </div>
        </div>
    );
}
