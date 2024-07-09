"use client";
import Link from "next/link";
import React, { useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ChevronDown, ChevronUp, Layout, Calendar, Settings, HelpCircle, DollarSign, Users, FileText, BarChart2, Briefcase, CreditCard, LucideIcon } from 'lucide-react';

interface OpenSections {
    main: boolean;
    hr: boolean;
    finance: boolean;
}

type SectionName = keyof OpenSections;

interface SidebarItemProps {
    icon: LucideIcon;
    text: string;
    href?: string;
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
        hr: false,
        finance: false,
    });

    const toggleSection = (section: SectionName) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, text, href = "#" }) => (
        <Link href={href} className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-indigo-50 group transition-colors duration-200">
            <Icon className="w-6 h-6 text-black-500 transition duration-75 group-hover:text-black-600" />
            <span className="ml-4 text-sm font-medium">{text}</span>
        </Link>
    );

    const SidebarSection: React.FC<SidebarSectionProps> = ({ title, items, isOpen, onToggle }) => (
        <div className="mb-4">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full p-3 text-base font-semibold text-left text-gray-900 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-colors duration-200"
            >
                <span>{title}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {isOpen && (
                <div className="mt-2 space-y-1 pl-6">
                    {items.map((item, index) => (
                        <SidebarItem key={index} icon={item.icon} text={item.text} href={item.href} />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <>
            <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="flex justify-start items-center">
                        <button
                            data-drawer-target="drawer-navigation"
                            data-drawer-toggle="drawer-navigation"
                            aria-controls="drawer-navigation"
                            className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <svg
                                aria-hidden="true"
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <svg
                                aria-hidden="true"
                                className="hidden w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="sr-only">Toggle sidebar</span>
                        </button>
                        <a className="flex items-center justify-between mr-4">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Cheap</span>
                        </a>
                        <form action="#" method="GET" className="hidden md:block md:pl-2">
                            <label htmlFor="topbar-search" className="sr-only">Search</label>

                        </form>
                    </div>
                    <div className="flex items-center lg:order-2">
                        <div className="relative md:w-64 md:w-96 pr-8">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    ></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="email"
                                id="topbar-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Search"
                            />
                        </div>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton>
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium">
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </nav>

            <aside className="fixed top-[64px] left-0 z-40 w-64 h-[calc(100%-64px)] overflow-y-auto bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidenav" id="drawer-navigation">
                <div className="h-full px-6 py-8">
                    <nav className="space-y-6">
                        <SidebarSection
                            title="Main"
                            isOpen={openSections.main}
                            onToggle={() => toggleSection('main')}
                            items={[
                                { icon: Layout, text: "Home" },
                                { icon: Calendar, text: "Calendar" },
                                { icon: Settings, text: "Settings" },
                                { icon: HelpCircle, text: "Help Center" },
                            ]}
                        />
                        <SidebarSection
                            title="Human Resources"
                            isOpen={openSections.hr}
                            onToggle={() => toggleSection('hr')}
                            items={[
                                { icon: Users, text: "Employees" },
                                { icon: BarChart2, text: "Performance" },
                                { icon: Briefcase, text: "Hiring" },
                            ]}
                        />
                        <SidebarSection
                            title="Finance"
                            isOpen={openSections.finance}
                            onToggle={() => toggleSection('finance')}
                            items={[
                                { icon: DollarSign, text: "PayRolls" },
                                { icon: FileText, text: "Invoices" },
                                { icon: CreditCard, text: "Expenses" },
                            ]}
                        />
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default NavbarAndSidebar;
