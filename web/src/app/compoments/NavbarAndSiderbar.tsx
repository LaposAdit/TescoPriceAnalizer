"use client";
import Link from "next/link";
import React, { useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ChevronDown, ChevronRight, Layout, Star, TableProperties, ShoppingBasket, DollarSign, FileText, BarChart2, Briefcase, CreditCard, LucideIcon, Search, Menu } from 'lucide-react';

interface OpenSections {
    main: boolean;
    tescoFavorites: boolean;
    finance: boolean;
}

type SectionName = keyof OpenSections;

interface SidebarItemProps {
    icon: LucideIcon;
    text: string;
    href: string;
}

interface SidebarSectionProps {
    title: string;
    items: SidebarItemProps[];
    isOpen: boolean;
    onToggle: () => void;
}


const NavbarAndSidebar: React.FC = () => {
    const [openSections, setOpenSections] = useState<OpenSections>({
        main: true,
        tescoFavorites: true,
        finance: true,
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSection = (section: SectionName) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, text, href }) => (
        <Link href={href} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150 ease-in-out">
            <Icon className="w-5 h-5 mr-3 text-gray-400" />
            <span className="text-sm">{text}</span>
        </Link>
    );

    const SidebarSection: React.FC<SidebarSectionProps> = ({ title, items, isOpen, onToggle }) => (
        <div className="mb-2">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-150 ease-in-out"
            >
                <span>{title}</span>
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isOpen && (
                <div className="mt-1 ml-4 space-y-1">
                    {items.map((item, index) => (
                        <SidebarItem key={index} {...item} />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <>
            <nav className="bg-white shadow-sm fixed left-0 right-0 top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
                                <span className="text-2xl font-bold text-indigo-600">Cheap</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="max-w-lg w-full lg:max-w-xs mr-4">
                                <label htmlFor="search" className="sr-only">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="search"
                                        name="search"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Search"
                                        type="search"
                                    />
                                </div>
                            </div>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                            <SignedOut>
                                <SignInButton>
                                    <button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </div>
                </div>
            </nav>

            <aside className={`fixed top-16 left-0 z-40 w-64 h-[calc(100%-64px)] overflow-y-auto bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <nav className="space-y-1">
                        <SidebarSection
                            title="Main"
                            isOpen={openSections.main}
                            onToggle={() => toggleSection('main')}
                            items={[
                                { icon: Layout, text: "Home", href: "/" },
                                { icon: ShoppingBasket, text: "Tesco", href: "/tesco" },
                                { icon: TableProperties, text: "Tesco Analytics", href: "/tesco/table" },
                            ]}
                        />
                        <SidebarSection
                            title="Tesco Favorites"
                            isOpen={openSections.tescoFavorites}
                            onToggle={() => toggleSection('tescoFavorites')}
                            items={[
                                { icon: Star, text: "Items", href: "/tesco/favorite" },
                                { icon: BarChart2, text: "Analytics", href: "/tesco/favorite/analytics" },
                                { icon: Briefcase, text: "Shop", href: "/hiring" },
                            ]}
                        />
                        <SidebarSection
                            title="Finance"
                            isOpen={openSections.finance}
                            onToggle={() => toggleSection('finance')}
                            items={[
                                { icon: DollarSign, text: "PayRolls", href: "/payrolls" },
                                { icon: FileText, text: "Invoices", href: "/invoices" },
                                { icon: CreditCard, text: "Expenses", href: "/expenses" },
                            ]}
                        />
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default NavbarAndSidebar;