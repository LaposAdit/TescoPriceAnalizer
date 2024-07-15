"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, ChevronDown, Grid, List, SortAsc, SortDesc, TrendingUp, Star, DollarSign, Percent, Calendar, Info, X, MapPin } from 'lucide-react';

interface Hotel {
    terminId: number;
    hotel: {
        nazov: string;
        obrazokUrl: string;
        stat: {
            nadpis: string;
        };
        oblast: {
            nadpis: string;
        };
        hviezdy: number;
        popis: string;
        kategorie: { text: string }[];
    };
    cenaCelkemOd: number;
    cenaZlava: number;
    cenaKatalog: number;
    datumOd: string;
    datumDo: string;
    dni: number;
    strava: { text: string }[];
    zlavaPercenta: number;
}


interface Filters {
    stars: string;
    minPrice: string;
    maxPrice: string;
    minDays: string;
    maxDays: string;
    mealType: string;
    category: string;
    minDiscount: string;
}


const LastMinuteHotelsPage: React.FC = () => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [filters, setFilters] = useState({
        countries: [] as string[],
        stars: '',
        minPrice: '',
        maxPrice: '',
        minDays: '',
        maxDays: '',
        mealType: '',
        category: '',
        minDiscount: '',
    });
    const [sortBy, setSortBy] = useState<'price' | 'stars' | 'discount' | 'days'>('price');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const toggleFilter = () => setIsFilterOpen(!isFilterOpen);


    const countries = Array.from(new Set(hotels.map(h => h.hotel.stat.nadpis)));




    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get<Hotel[]>('http://localhost:3000/dovolenka/last-minute-cards');
                setHotels(response.data);
                setFilteredHotels(response.data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        };
        fetchHotels();
    }, []);

    useEffect(() => {
        const filtered = hotels.filter(hotel => {
            return (
                (filters.countries.length === 0 || filters.countries.includes(hotel.hotel.stat.nadpis)) &&
                (filters.stars === '' || hotel.hotel.hviezdy === parseInt(filters.stars)) &&
                (filters.minPrice === '' || hotel.cenaCelkemOd >= parseInt(filters.minPrice)) &&
                (filters.maxPrice === '' || hotel.cenaCelkemOd <= parseInt(filters.maxPrice)) &&
                (filters.minDays === '' || hotel.dni >= parseInt(filters.minDays)) &&
                (filters.maxDays === '' || hotel.dni <= parseInt(filters.maxDays)) &&
                (filters.mealType === '' || hotel.strava.some(s => s.text.toLowerCase().includes(filters.mealType.toLowerCase()))) &&
                (filters.category === '' || hotel.hotel.kategorie.some(k => k.text.toLowerCase().includes(filters.category.toLowerCase()))) &&
                (filters.minDiscount === '' || hotel.zlavaPercenta >= parseInt(filters.minDiscount))
            );
        });

        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'price') {
                return sortOrder === 'asc' ? a.cenaCelkemOd - b.cenaCelkemOd : b.cenaCelkemOd - a.cenaCelkemOd;
            } else if (sortBy === 'stars') {
                return sortOrder === 'asc' ? a.hotel.hviezdy - b.hotel.hviezdy : b.hotel.hviezdy - a.hotel.hviezdy;
            } else if (sortBy === 'discount') {
                return sortOrder === 'asc' ? a.zlavaPercenta - b.zlavaPercenta : b.zlavaPercenta - a.zlavaPercenta;
            } else if (sortBy === 'days') {
                return sortOrder === 'asc' ? a.dni - b.dni : b.dni - a.dni;
            }
            return 0;
        });

        setFilteredHotels(sorted);
    }, [hotels, filters, sortBy, sortOrder]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCountries = Array.from(e.target.selectedOptions, option => option.value);
        setFilters(prev => ({ ...prev, countries: selectedCountries }));
    };

    const handleSortChange = (newSortBy: 'price' | 'stars' | 'discount' | 'days') => {
        if (newSortBy === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('asc');
        }
    };

    const getBestHotel = (): Hotel | undefined => {
        return filteredHotels.reduce((best, current) => {
            const currentScore = current.hotel.hviezdy + (current.zlavaPercenta / 100) - (current.cenaCelkemOd / 10000);
            const bestScore = best.hotel.hviezdy + (best.zlavaPercenta / 100) - (best.cenaCelkemOd / 10000);
            return currentScore > bestScore ? current : best;
        }, filteredHotels[0]);
    };

    const renderHotelCard = (hotel: Hotel) => (
        <div key={hotel.terminId} className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg">
            <img src={hotel.hotel.obrazokUrl} alt={hotel.hotel.nazov} className="w-full h-48 object-cover rounded-md mb-4" />
            <h2 className="text-xl font-bold mb-2">{hotel.hotel.nazov}</h2>
            <p className="text-gray-600 mb-2">{hotel.hotel.stat.nadpis}, {hotel.hotel.oblast.nadpis}</p>
            <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-500">{'★'.repeat(hotel.hotel.hviezdy)}</span>
                <span className="text-green-600 font-bold">€{hotel.cenaCelkemOd.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{hotel.datumOd.split('T')[0]} - {hotel.datumDo.split('T')[0]} ({hotel.dni} days)</p>
            <p className="text-sm text-blue-500 mb-2">Discount: {hotel.zlavaPercenta}%</p>
            <button
                onClick={() => setSelectedHotel(hotel)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
                View Details
            </button>
        </div>
    );

    const renderHotelRow = (hotel: Hotel) => (
        <tr key={hotel.terminId} className="hover:bg-gray-50">
            <td className="py-2 px-4">{hotel.hotel.nazov}</td>
            <td className="py-2 px-4">{hotel.hotel.stat.nadpis}, {hotel.hotel.oblast.nadpis}</td>
            <td className="py-2 px-4">{'★'.repeat(hotel.hotel.hviezdy)}</td>
            <td className="py-2 px-4">€{hotel.cenaCelkemOd.toFixed(2)}</td>
            <td className="py-2 px-4">{hotel.datumOd.split('T')[0]} - {hotel.datumDo.split('T')[0]} ({hotel.dni} days)</td>
            <td className="py-2 px-4">{hotel.zlavaPercenta}%</td>
            <td className="py-2 px-4">{hotel.strava.map(s => s.text).join(', ')}</td>
            <td className="py-2 px-4">
                <button
                    onClick={() => setSelectedHotel(hotel)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                    Details
                </button>
            </td>
        </tr>
    );

    const renderHotelDetails = (hotel: Hotel) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">{hotel.hotel.nazov}</h2>
                <img src={hotel.hotel.obrazokUrl} alt={hotel.hotel.nazov} className="w-full h-64 object-cover rounded-md mb-4" />
                <p className="text-gray-600 mb-4">{hotel.hotel.popis}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p><strong>Location:</strong> {hotel.hotel.stat.nadpis}, {hotel.hotel.oblast.nadpis}</p>
                        <p><strong>Stars:</strong> {'★'.repeat(hotel.hotel.hviezdy)}</p>
                        <p><strong>Price:</strong> €{hotel.cenaCelkemOd.toFixed(2)}</p>
                        <p><strong>Original Price:</strong> €{hotel.cenaKatalog.toFixed(2)}</p>
                    </div>
                    <div>
                        <p><strong>Discount:</strong> {hotel.zlavaPercenta}%</p>
                        <p><strong>Dates:</strong> {hotel.datumOd.split('T')[0]} - {hotel.datumDo.split('T')[0]}</p>
                        <p><strong>Duration:</strong> {hotel.dni} days</p>
                        <p><strong>Meals:</strong> {hotel.strava.map(s => s.text).join(', ')}</p>
                    </div>
                </div>
                <p><strong>Categories:</strong> {hotel.hotel.kategorie.map(k => k.text).join(', ')}</p>
                <button
                    onClick={() => setSelectedHotel(null)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                    Close
                </button>
            </div>
        </div>
    );

    const bestHotel = getBestHotel();

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Last Minute Hotel Deals</h1>

                {bestHotel && (
                    <div className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
                        <h2 className="text-2xl font-bold mb-2 flex items-center">
                            <TrendingUp className="mr-2" /> Best Value Hotel
                        </h2>
                        <p className="text-xl">{bestHotel.hotel.nazov} - {bestHotel.hotel.stat.nadpis}</p>
                        <p className="text-3xl font-bold mt-2">€{bestHotel.cenaCelkemOd.toFixed(2)} <span className="text-lg font-normal">(Discount: {bestHotel.zlavaPercenta}%)</span></p>
                    </div>
                )}
                <div className="mb-8">
                    <button
                        onClick={toggleFilter}
                        className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-md"
                    >
                        <Filter className="mr-2" size={20} />
                        Filters
                        <ChevronDown className={`ml-2 transition-transform duration-300 ${isFilterOpen ? 'transform rotate-180' : ''}`} size={20} />
                    </button>

                    {isFilterOpen && (
                        <div className="mt-4 bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Destinations</h3>
                                    <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                                        {countries.map(country => (
                                            <button
                                                key={country}
                                                onClick={() => handleCountryChange({ target: { value: country } } as React.ChangeEvent<HTMLSelectElement>)}
                                                className={`flex items-center justify-center p-2 rounded-lg transition-colors duration-200 ${filters.countries.includes(country)
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white text-gray-600 hover:bg-indigo-100'
                                                    }`}
                                            >
                                                <MapPin size={16} className="mr-1" />
                                                {country}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Hotel Rating</h3>
                                    <div className="flex justify-between">
                                        {[3, 4, 5].map(stars => (
                                            <button
                                                key={stars}
                                                onClick={() => handleFilterChange({ target: { name: 'stars', value: stars.toString() } } as React.ChangeEvent<HTMLInputElement>)}
                                                className={`px-4 py-2 rounded-full flex items-center ${filters.stars === stars.toString()
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'
                                                    }`}
                                            >
                                                {stars} <Star size={16} className="ml-1" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Price Range</h3>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="range"
                                            name="minPrice"
                                            min="0"
                                            max="5000"
                                            value={filters.minPrice}
                                            onChange={handleFilterChange}
                                            className="w-full"
                                        />
                                        <span className="text-gray-600">€{filters.minPrice || 0}</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="range"
                                            name="maxPrice"
                                            min="0"
                                            max="5000"
                                            value={filters.maxPrice}
                                            onChange={handleFilterChange}
                                            className="w-full"
                                        />
                                        <span className="text-gray-600">€{filters.maxPrice || 5000}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Duration</h3>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="range"
                                            name="minDays"
                                            min="1"
                                            max="30"
                                            value={filters.minDays}
                                            onChange={handleFilterChange}
                                            className="w-full"
                                        />
                                        <span className="text-gray-600">{filters.minDays || 1} days</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="range"
                                            name="maxDays"
                                            min="1"
                                            max="30"
                                            value={filters.maxDays}
                                            onChange={handleFilterChange}
                                            className="w-full"
                                        />
                                        <span className="text-gray-600">{filters.maxDays || 30} days</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Meal Type</h3>
                                    <input
                                        type="text"
                                        name="mealType"
                                        value={filters.mealType}
                                        onChange={handleFilterChange}
                                        placeholder="e.g., All Inclusive"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Min Discount</h3>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="range"
                                            name="minDiscount"
                                            min="0"
                                            max="100"
                                            value={filters.minDiscount}
                                            onChange={handleFilterChange}
                                            className="w-full"
                                        />
                                        <span className="text-gray-600">{filters.minDiscount || 0}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>



                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        {['price', 'stars', 'discount', 'days'].map((sortOption) => (
                            <button
                                key={sortOption}
                                onClick={() => handleSortChange(sortOption as 'price' | 'stars' | 'discount' | 'days')}
                                className={`px-4 py-2 rounded-md transition-colors duration-200 ${sortBy === sortOption
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                                {sortBy === sortOption && (sortOrder === 'asc' ? <SortAsc className="inline ml-1" /> : <SortDesc className="inline ml-1" />)}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                            <Grid />
                        </button>
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                            <List />
                        </button>
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredHotels.map((hotel) => (
                            <div key={hotel.terminId} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                                <img src={hotel.hotel.obrazokUrl} alt={hotel.hotel.nazov} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{hotel.hotel.nazov}</h2>
                                    <p className="text-gray-600 mb-2">{hotel.hotel.stat.nadpis}, {hotel.hotel.oblast.nadpis}</p>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-yellow-500">{'★'.repeat(hotel.hotel.hviezdy)}</span>
                                        <span className="text-2xl font-bold text-green-600">€{hotel.cenaCelkemOd.toFixed(2)}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{hotel.datumOd.split('T')[0]} - {hotel.datumDo.split('T')[0]} ({hotel.dni} days)</p>
                                    <p className="text-sm text-blue-500 mb-2">Discount: {hotel.zlavaPercenta}%</p>
                                    <button
                                        onClick={() => setSelectedHotel(hotel)}
                                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left">Hotel</th>
                                    <th className="py-3 px-4 text-left">Location</th>
                                    <th className="py-3 px-4 text-left">Stars</th>
                                    <th className="py-3 px-4 text-left">Price</th>
                                    <th className="py-3 px-4 text-left">Dates</th>
                                    <th className="py-3 px-4 text-left">Discount</th>
                                    <th className="py-3 px-4 text-left">Meals</th>
                                    <th className="py-3 px-4 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHotels.map(renderHotelRow)}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedHotel && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                            <button
                                onClick={() => setSelectedHotel(null)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold mb-4">{selectedHotel.hotel.nazov}</h2>
                            <img src={selectedHotel.hotel.obrazokUrl} alt={selectedHotel.hotel.nazov} className="w-full h-64 object-cover rounded-md mb-4" />
                            <p className="text-gray-600 mb-4">{selectedHotel.hotel.popis}</p>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p><strong>Location:</strong> {selectedHotel.hotel.stat.nadpis}, {selectedHotel.hotel.oblast.nadpis}</p>
                                    <p><strong>Stars:</strong> {'★'.repeat(selectedHotel.hotel.hviezdy)}</p>
                                    <p><strong>Price:</strong> €{selectedHotel.cenaCelkemOd.toFixed(2)}</p>
                                    <p><strong>Original Price:</strong> €{selectedHotel.cenaKatalog.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p><strong>Discount:</strong> {selectedHotel.zlavaPercenta}%</p>
                                    <p><strong>Dates:</strong> {selectedHotel.datumOd.split('T')[0]} - {selectedHotel.datumDo.split('T')[0]}</p>
                                    <p><strong>Duration:</strong> {selectedHotel.dni} days</p>
                                    <p><strong>Meals:</strong> {selectedHotel.strava.map(s => s.text).join(', ')}</p>
                                </div>
                            </div>
                            <p><strong>Categories:</strong> {selectedHotel.hotel.kategorie.map(k => k.text).join(', ')}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LastMinuteHotelsPage;
