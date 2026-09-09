import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const NAV_ICONS = {
    'Dashboard': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>,
    'Schedule / Classes': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    'Students': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
    'Courses': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>,
    'Batches': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
    'Fees & Collection': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>,
    // Superadmin specific
    'Teachers': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M18 19V10a2 2 0 00-2-2h-.5a2 2 0 100 4h1a2 2 0 012 2v3m-6 2a2 2 0 11-4 0 2 2 0 014 0zM6 19a3 3 0 100-6 3 3 0 000 6z"></path></svg>,
    'Packages': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>,
    'Coaching List': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>,
    'Report': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
};

const SidebarLink = ({ href, active, icon, comingSoon, children }) => {
    if (comingSoon) {
        return (
            <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mx-2 text-gray-400 bg-transparent cursor-not-allowed select-none">
                <span className="flex-shrink-0 text-gray-300">
                    {icon}
                </span>
                <span className="flex-1 min-w-0 truncate">{children}</span>
                <span className="ml-auto text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded flex-shrink-0">
                    Soon
                </span>
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mx-2
                ${active
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
        >
            <span className={`flex-shrink-0 transition-colors ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {icon}
            </span>
            <span className="flex-1 min-w-0 truncate">{children}</span>
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />}
        </Link>
    );
};

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingMobileMenu, setShowingMobileMenu] = useState(false);

    const superAdminNav = [
        { name: 'Dashboard', href: route('superadmin.dashboard'), active: route().current('superadmin.dashboard') },
        { name: 'Packages', href: route('superadmin.packages.index'), active: route().current('superadmin.packages.*') },
        { name: 'Coaching List', href: route('superadmin.organizations.index'), active: route().current('superadmin.organizations.*') },
        { name: 'Report', href: '#', active: false, comingSoon: true },
    ];

    const regularNav = [
        { name: 'Dashboard', href: route('dashboard'), active: route().current('dashboard') },
        { name: 'Schedule / Classes', href: route('classes.index'), active: route().current('classes.*') },
        { name: 'Students', href: route('students.index'), active: route().current('students.*') },
        { name: 'Courses', href: route('courses.index'), active: route().current('courses.*') },
        { name: 'Batches', href: route('batches.index'), active: route().current('batches.*') },
        { name: 'Fees & Collection', href: route('invoices.index'), active: route().current('invoices.*') },
        { name: 'Broadcasts', href: route('broadcasts.index'), active: route().current('broadcasts.*') },
        { name: 'Reports', href: route('reports.index'), active: route().current('reports.*') },
        { name: 'Settings', href: route('profile.edit'), active: route().current('profile.edit') },
    ];

    const navItems = user.role === 'superadmin' ? superAdminNav : [...regularNav];

    // Admins also get the staff management link; insert it before "Fees & Collection".
    if (user.role === 'admin') {
        const teachersLink = { name: 'Teachers', href: route('teachers.index'), active: route().current('teachers.*') };
        const feesIndex = navItems.findIndex((item) => item.name === 'Fees & Collection');
        if (feesIndex === -1) {
            navItems.push(teachersLink);
        } else {
            navItems.splice(feesIndex, 0, teachersLink);
        }
    }

    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* ── Sidebar ── */}
            <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-200 fixed inset-y-0 z-10 shadow-sm">
                {/* Logo */}
                <div className="flex items-center gap-3 h-16 px-5 border-b border-gray-100 flex-shrink-0">
                    <ApplicationLogo className="w-8 h-8 rounded-lg shadow-sm" />
                    <div>
                        <span className="text-sm font-bold text-gray-900">Coaching<span className="text-indigo-600">CRM</span></span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 space-y-0.5">
                    {/* Group label */}
                    <p className="px-5 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Main Menu</p>
                    {navItems.map((item) => (
                        <SidebarLink key={item.name} href={item.href} active={item.active} icon={NAV_ICONS[item.name]} comingSoon={item.comingSoon}>
                            {item.name}
                        </SidebarLink>
                    ))}
                </nav>

                {/* User card */}
                <div className="p-3 border-t border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-default">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">{user.name}</div>
                            <div className="text-xs text-gray-400 capitalize truncate">{user.role}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main content ── */}
            <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
                {/* Top bar */}
                <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm">
                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setShowingMobileMenu(!showingMobileMenu)}
                        className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showingMobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                        </svg>
                    </button>

                    {/* Page header slot */}
                    <div className="flex-1 md:flex items-center hidden">
                        {header && <div className="text-gray-800 font-semibold text-sm">{header}</div>}
                    </div>

                    {/* Right side user menu */}
                    <div className="flex items-center gap-3 ml-auto">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
                                        {initials}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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
                    <div className="md:hidden bg-white border-b border-gray-200 shadow-sm">
                        <div className="py-2 space-y-0.5 px-2">
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
                    <header className="md:hidden bg-white border-b border-gray-200 px-6 py-4">
                        {header}
                    </header>
                )}

                {/* Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
