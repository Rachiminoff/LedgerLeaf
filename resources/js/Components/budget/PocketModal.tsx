import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Icon } from '@iconify/react';
import { usePage } from '@inertiajs/react';

interface PocketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    mode: 'create' | 'edit';
    pocket: any;
    safeBalance?: number;
}

interface IconCategory {
    name: string;
    icons: Array<{ value: string; label: string }>;
}

export default function PocketModal({ 
    isOpen, 
    onClose, 
    onSave, 
    mode, 
    pocket,
    safeBalance = 0 
}: PocketModalProps) {
    const { auth } = usePage().props;
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: 'mdi:folder',
        color: '#5CB85C',
        allocated: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

    useEffect(() => {
        setError(null);
        
        if (pocket && mode === 'edit') {
            setFormData({
                name: pocket.name || '',
                description: pocket.description || '',
                icon: pocket.icon || 'mdi:folder',
                color: pocket.color || '#5CB85C',
                allocated: '',
            });
        } else {
            setFormData({
                name: '',
                description: '',
                icon: 'mdi:folder',
                color: '#5CB85C',
                allocated: '',
            });
        }
    }, [pocket, mode, isOpen]);

    const handleAllocationChange = (value: string) => {
        setFormData({ ...formData, allocated: value });
        
        if (error) setError(null);
        
        const amount = parseFloat(value);
        if (mode === 'create' && amount > 0 && amount > safeBalance) {
            setError(`Amount exceeds safe balance of ₱${safeBalance.toFixed(2)}`);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const allocatedAmount = parseFloat(formData.allocated) || 0;
        
        if (mode === 'create' && allocatedAmount > safeBalance) {
            setError(`Amount exceeds safe balance of ₱${safeBalance.toFixed(2)}`);
            return;
        }
        
        const saveData: any = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            icon: formData.icon,
            color: formData.color,
        };

        if (mode === 'create') {
            saveData.allocated = allocatedAmount;
        }

        onSave(saveData);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const colorOptions = [
        '#5CB85C', '#3B82F6', '#EF4444', '#F4B400', '#8B5CF6', '#EC4899', '#06B6D4',
        '#10B981', '#F59E0B', '#6366F1', '#14B8A6', '#F472B6', '#8B5CF6', '#0EA5E9'
    ];

    const iconCategories: IconCategory[] = [
        {
            name: 'All',
            icons: [
                // Food & Dining
                { value: 'mdi:food', label: 'Food' },
                { value: 'mdi:food-apple', label: 'Apple' },
                { value: 'mdi:coffee', label: 'Coffee' },
                { value: 'mdi:silverware', label: 'Silverware' },
                { value: 'mdi:restaurant', label: 'Restaurant' },
                // Shopping
                { value: 'mdi:shopping', label: 'Shopping' },
                { value: 'mdi:cart', label: 'Cart' },
                { value: 'mdi:bag-personal', label: 'Bag' },
                // Transportation
                { value: 'mdi:car', label: 'Car' },
                { value: 'mdi:bus', label: 'Bus' },
                { value: 'mdi:train', label: 'Train' },
                { value: 'mdi:airplane', label: 'Airplane' },
                { value: 'mdi:gas-station', label: 'Gas Station' },
                { value: 'mdi:bike', label: 'Bike' },
                // Bills & Utilities
                { value: 'mdi:file-document', label: 'Document' },
                { value: 'mdi:home', label: 'Home' },
                { value: 'mdi:lightbulb', label: 'Lightbulb' },
                { value: 'mdi:water', label: 'Water' },
                { value: 'mdi:phone', label: 'Phone' },
                { value: 'mdi:internet', label: 'Internet' },
                // Healthcare
                { value: 'mdi:heart-pulse', label: 'Heart' },
                { value: 'mdi:hospital', label: 'Hospital' },
                { value: 'mdi:medical-bag', label: 'Medical Bag' },
                { value: 'mdi:pill', label: 'Pill' },
                // Education
                { value: 'mdi:school', label: 'School' },
                { value: 'mdi:book', label: 'Book' },
                { value: 'mdi:graduation-cap', label: 'Graduation' },
                // Entertainment
                { value: 'mdi:gamepad', label: 'Game' },
                { value: 'mdi:movie', label: 'Movie' },
                { value: 'mdi:music', label: 'Music' },
                { value: 'mdi:theater', label: 'Theater' },
                // Income
                { value: 'mdi:cash', label: 'Cash' },
                { value: 'mdi:cash-multiple', label: 'Cash Multiple' },
                { value: 'mdi:laptop', label: 'Laptop' },
                { value: 'mdi:briefcase', label: 'Briefcase' },
                { value: 'mdi:bank', label: 'Bank' },
                // General
                { value: 'mdi:folder', label: 'Folder' },
                { value: 'mdi:chart-bar', label: 'Chart Bar' },
                { value: 'mdi:chart-pie', label: 'Chart Pie' },
                { value: 'mdi:target', label: 'Target' },
                { value: 'mdi:gift', label: 'Gift' },
                { value: 'mdi:star', label: 'Star' },
                { value: 'mdi:heart', label: 'Heart' },
                { value: 'mdi:fire', label: 'Fire' },
                { value: 'mdi:cube', label: 'Cube' },
                { value: 'mdi:rocket', label: 'Rocket' },
                // Personal Care
                { value: 'mdi:spa', label: 'Spa' },
                { value: 'mdi:human', label: 'Person' },
                // Pets
                { value: 'mdi:paw', label: 'Paw' },
                { value: 'mdi:dog', label: 'Dog' },
                { value: 'mdi:cat', label: 'Cat' },
                // Tech
                { value: 'mdi:cellphone', label: 'Phone' },
                { value: 'mdi:desktop-classic', label: 'Desktop' },
                { value: 'mdi:headphones', label: 'Headphones' },
                // Travel
                { value: 'mdi:beach', label: 'Beach' },
                { value: 'mdi:campfire', label: 'Campfire' },
                { value: 'mdi:luggage', label: 'Luggage' },
            ]
        },
        {
            name: 'Food & Dining',
            icons: [
                { value: 'mdi:food', label: 'Food' },
                { value: 'mdi:food-apple', label: 'Apple' },
                { value: 'mdi:coffee', label: 'Coffee' },
                { value: 'mdi:silverware', label: 'Silverware' },
                { value: 'mdi:restaurant', label: 'Restaurant' },
                { value: 'mdi:food-fork-drink', label: 'Fork & Drink' },
                { value: 'mdi:food-variant', label: 'Food Variant' },
                { value: 'mdi:cup-water', label: 'Cup Water' },
            ]
        },
        {
            name: 'Shopping',
            icons: [
                { value: 'mdi:shopping', label: 'Shopping' },
                { value: 'mdi:cart', label: 'Cart' },
                { value: 'mdi:bag-personal', label: 'Bag' },
                { value: 'mdi:shopping-outline', label: 'Shopping Outline' },
                { value: 'mdi:cart-outline', label: 'Cart Outline' },
                { value: 'mdi:bag-check', label: 'Bag Check' },
            ]
        },
        {
            name: 'Transportation',
            icons: [
                { value: 'mdi:car', label: 'Car' },
                { value: 'mdi:bus', label: 'Bus' },
                { value: 'mdi:train', label: 'Train' },
                { value: 'mdi:airplane', label: 'Airplane' },
                { value: 'mdi:gas-station', label: 'Gas Station' },
                { value: 'mdi:bike', label: 'Bike' },
                { value: 'mdi:taxi', label: 'Taxi' },
                { value: 'mdi:motorbike', label: 'Motorbike' },
                { value: 'mdi:subway', label: 'Subway' },
                { value: 'mdi:car-sports', label: 'Sports Car' },
            ]
        },
        {
            name: 'Bills & Utilities',
            icons: [
                { value: 'mdi:file-document', label: 'Document' },
                { value: 'mdi:home', label: 'Home' },
                { value: 'mdi:lightbulb', label: 'Lightbulb' },
                { value: 'mdi:water', label: 'Water' },
                { value: 'mdi:phone', label: 'Phone' },
                { value: 'mdi:internet', label: 'Internet' },
                { value: 'mdi:home-thermometer', label: 'Thermostat' },
                { value: 'mdi:water-boiler', label: 'Water Boiler' },
                { value: 'mdi:washing-machine', label: 'Washing Machine' },
            ]
        },
        {
            name: 'Healthcare',
            icons: [
                { value: 'mdi:heart-pulse', label: 'Heart' },
                { value: 'mdi:hospital', label: 'Hospital' },
                { value: 'mdi:medical-bag', label: 'Medical Bag' },
                { value: 'mdi:pill', label: 'Pill' },
                { value: 'mdi:doctor', label: 'Doctor' },
                { value: 'mdi:dentist', label: 'Dentist' },
                { value: 'mdi:pharmacy', label: 'Pharmacy' },
                { value: 'mdi:blood-bag', label: 'Blood Bag' },
            ]
        },
        {
            name: 'Education',
            icons: [
                { value: 'mdi:school', label: 'School' },
                { value: 'mdi:book', label: 'Book' },
                { value: 'mdi:graduation-cap', label: 'Graduation' },
                { value: 'mdi:bookshelf', label: 'Bookshelf' },
                { value: 'mdi:book-open', label: 'Book Open' },
                { value: 'mdi:library', label: 'Library' },
            ]
        },
        {
            name: 'Entertainment',
            icons: [
                { value: 'mdi:gamepad', label: 'Game' },
                { value: 'mdi:movie', label: 'Movie' },
                { value: 'mdi:music', label: 'Music' },
                { value: 'mdi:theater', label: 'Theater' },
                { value: 'mdi:bowling', label: 'Bowling' },
                { value: 'mdi:guitar', label: 'Guitar' },
                { value: 'mdi:microphone', label: 'Microphone' },
                { value: 'mdi:television', label: 'Television' },
            ]
        },
        {
            name: 'Income',
            icons: [
                { value: 'mdi:cash', label: 'Cash' },
                { value: 'mdi:cash-multiple', label: 'Cash Multiple' },
                { value: 'mdi:laptop', label: 'Laptop' },
                { value: 'mdi:briefcase', label: 'Briefcase' },
                { value: 'mdi:bank', label: 'Bank' },
                { value: 'mdi:chart-line', label: 'Chart Line' },
                { value: 'mdi:currency-usd', label: 'Currency' },
                { value: 'mdi:wallet', label: 'Wallet' },
            ]
        },
        {
            name: 'General',
            icons: [
                { value: 'mdi:folder', label: 'Folder' },
                { value: 'mdi:chart-bar', label: 'Chart Bar' },
                { value: 'mdi:chart-pie', label: 'Chart Pie' },
                { value: 'mdi:target', label: 'Target' },
                { value: 'mdi:gift', label: 'Gift' },
                { value: 'mdi:star', label: 'Star' },
                { value: 'mdi:heart', label: 'Heart' },
                { value: 'mdi:fire', label: 'Fire' },
                { value: 'mdi:cube', label: 'Cube' },
                { value: 'mdi:rocket', label: 'Rocket' },
                { value: 'mdi:shield', label: 'Shield' },
                { value: 'mdi:flag', label: 'Flag' },
                { value: 'mdi:lightning', label: 'Lightning' },
                { value: 'mdi:cloud', label: 'Cloud' },
            ]
        },
        {
            name: 'Personal Care',
            icons: [
                { value: 'mdi:spa', label: 'Spa' },
                { value: 'mdi:human', label: 'Person' },
                { value: 'mdi:tooth', label: 'Tooth' },
                { value: 'mdi:face', label: 'Face' },
                { value: 'mdi:shower', label: 'Shower' },
                { value: 'mdi:bathtub', label: 'Bathtub' },
            ]
        },
        {
            name: 'Pets',
            icons: [
                { value: 'mdi:paw', label: 'Paw' },
                { value: 'mdi:dog', label: 'Dog' },
                { value: 'mdi:cat', label: 'Cat' },
                { value: 'mdi:bone', label: 'Bone' },
                { value: 'mdi:fish', label: 'Fish' },
                { value: 'mdi:bird', label: 'Bird' },
            ]
        },
        {
            name: 'Technology',
            icons: [
                { value: 'mdi:cellphone', label: 'Phone' },
                { value: 'mdi:desktop-classic', label: 'Desktop' },
                { value: 'mdi:headphones', label: 'Headphones' },
                { value: 'mdi:laptop', label: 'Laptop' },
                { value: 'mdi:tablet', label: 'Tablet' },
                { value: 'mdi:printer', label: 'Printer' },
                { value: 'mdi:camera', label: 'Camera' },
                { value: 'mdi:robot', label: 'Robot' },
            ]
        },
        {
            name: 'Travel',
            icons: [
                { value: 'mdi:beach', label: 'Beach' },
                { value: 'mdi:campfire', label: 'Campfire' },
                { value: 'mdi:luggage', label: 'Luggage' },
                { value: 'mdi:hotel', label: 'Hotel' },
                { value: 'mdi:compass', label: 'Compass' },
                { value: 'mdi:map', label: 'Map' },
                { value: 'mdi:binoculars', label: 'Binoculars' },
            ]
        },
        {
            name: 'Fitness',
            icons: [
                { value: 'mdi:run', label: 'Run' },
                { value: 'mdi:bike', label: 'Bike' },
                { value: 'mdi:weight', label: 'Weight' },
                { value: 'mdi:yoga', label: 'Yoga' },
                { value: 'mdi:dumbbell', label: 'Dumbbell' },
                { value: 'mdi:swim', label: 'Swim' },
            ]
        },
        {
            name: 'Home & Garden',
            icons: [
                { value: 'mdi:home', label: 'Home' },
                { value: 'mdi:flower', label: 'Flower' },
                { value: 'mdi:tree', label: 'Tree' },
                { value: 'mdi:grass', label: 'Grass' },
                { value: 'mdi:potted-plant', label: 'Potted Plant' },
                { value: 'mdi:toolbox', label: 'Toolbox' },
                { value: 'mdi:hammer', label: 'Hammer' },
            ]
        }
    ];

    // Get filtered icons based on active category
    const getFilteredIcons = () => {
        let icons: Array<{ value: string; label: string }> = [];
        
        if (activeCategory === 'All') {
            // Get all icons from all categories
            iconCategories.forEach(cat => {
                if (cat.name !== 'All') {
                    icons = [...icons, ...cat.icons];
                }
            });
        } else {
            // Get icons from specific category
            const category = iconCategories.find(cat => cat.name === activeCategory);
            icons = category?.icons || [];
        }

        // Remove duplicates
        const seen = new Set();
        return icons.filter(icon => {
            const duplicate = seen.has(icon.value);
            seen.add(icon.value);
            return !duplicate;
        });
    };

    const filteredIcons = getFilteredIcons();

    const allocatedAmount = parseFloat(formData.allocated) || 0;
    const isOverSafeBalance = mode === 'create' && allocatedAmount > safeBalance;

    // Get category names for filter chips (excluding 'All')
    const categoryNames = iconCategories
        .filter(cat => cat.name !== 'All')
        .map(cat => cat.name);

    // Show only first 5 categories initially
    const visibleCategories = showAllCategories ? categoryNames : categoryNames.slice(0, 5);
    const hasMoreCategories = categoryNames.length > 5;

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-lg bg-[#111111] rounded-2xl shadow-xl border border-[#242424] max-h-[90vh] flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b border-[#242424] flex-shrink-0">
                                <Dialog.Title className="text-lg font-semibold text-white">
                                    {mode === 'create' ? 'Create Pocket' : 'Edit Pocket'}
                                </Dialog.Title>
                                <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#242424] transition-colors">
                                    <X className="w-5 h-5 text-[#9A9A9A]" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 modal-scrollbar">
                                {/* Safe Balance Display */}
                                {mode === 'create' && (
                                    <div className="p-3 rounded-lg bg-[#171717] border border-[#242424]">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[#9A9A9A]">Safe Balance</span>
                                            <span className="text-sm font-semibold text-[#5CB85C]">
                                                {formatCurrency(safeBalance)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                        <p className="text-sm text-red-500">{error}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">Pocket Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none resize-none"
                                        rows={2}
                                    />
                                </div>

                                {/* Icon Selection with Filter Chips */}
                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">Icon</label>
                                    
                                    {/* Filter Chips */}
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        <button
                                            type="button"
                                            onClick={() => setActiveCategory('All')}
                                            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                                                activeCategory === 'All'
                                                    ? 'bg-[#5CB85C] text-black'
                                                    : 'bg-[#1A1A1A] text-[#9A9A9A] border border-[#242424] hover:border-[#5CB85C]'
                                            }`}
                                        >
                                            All
                                        </button>
                                        {visibleCategories.map((name) => (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() => setActiveCategory(name)}
                                                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                                                    activeCategory === name
                                                        ? 'bg-[#5CB85C] text-black'
                                                        : 'bg-[#1A1A1A] text-[#9A9A9A] border border-[#242424] hover:border-[#5CB85C]'
                                                }`}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                        {hasMoreCategories && (
                                            <button
                                                type="button"
                                                onClick={() => setShowAllCategories(!showAllCategories)}
                                                className="px-2.5 py-1 text-xs rounded-full bg-[#1A1A1A] text-[#9A9A9A] border border-[#242424] hover:border-[#5CB85C] transition-colors flex items-center gap-0.5"
                                            >
                                                {showAllCategories ? 'Show Less' : `+${categoryNames.length - 5} More`}
                                                {showAllCategories ? (
                                                    <ChevronUp className="w-3 h-3" />
                                                ) : (
                                                    <ChevronDown className="w-3 h-3" />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Icon Grid */}
                                    <div className="grid grid-cols-8 gap-1.5 max-h-32 overflow-y-auto p-1 bg-[#0D0D0D] rounded-lg border border-[#242424]">
                                        {filteredIcons.map((icon) => (
                                            <button
                                                key={icon.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon: icon.value })}
                                                className={`p-1.5 rounded transition-all flex flex-col items-center ${
                                                    formData.icon === icon.value
                                                        ? 'bg-[#5CB85C] text-black'
                                                        : 'bg-[#171717] hover:bg-[#242424] text-[#9A9A9A] hover:text-white'
                                                }`}
                                                title={icon.label}
                                            >
                                                <Icon icon={icon.value} className="w-5 h-5" />
                                                <span className="text-[6px] leading-none truncate w-full text-center">
                                                    {icon.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color })}
                                                className={`w-8 h-8 rounded-full transition-all ${
                                                    formData.color === color
                                                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111111]'
                                                        : ''
                                                }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Amount Input */}
                                {mode === 'create' && (
                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">
                                            Initial Allocation
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            value={formData.allocated}
                                            onChange={(e) => handleAllocationChange(e.target.value)}
                                            className={`w-full px-3 py-2 bg-[#171717] border rounded-lg text-white focus:border-[#5CB85C] focus:outline-none ${
                                                isOverSafeBalance 
                                                    ? 'border-red-500 focus:ring-red-500' 
                                                    : 'border-[#242424]'
                                            }`}
                                        />
                                        {safeBalance > 0 && (
                                            <div className="mt-1 text-xs text-[#9A9A9A]">
                                                Available: {formatCurrency(safeBalance)}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Current Allocation (Edit Mode) */}
                                {mode === 'edit' && pocket && (
                                    <div className="p-3 rounded-lg bg-[#171717] border border-[#242424]">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[#9A9A9A]">Current Allocation</span>
                                            <span className="text-sm font-semibold text-white">
                                                {formatCurrency(pocket.allocated || 0)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#6B7280] mt-1">
                                            Allocation amount cannot be changed in edit mode. Use the Allocate Funds action to adjust.
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4 border-t border-[#242424]">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!!error || isOverSafeBalance}
                                        className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                                            error || isOverSafeBalance
                                                ? 'bg-[#242424] text-[#9A9A9A] cursor-not-allowed'
                                                : 'bg-[#5CB85C] text-black hover:bg-[#6FCF70]'
                                        }`}
                                    >
                                        {mode === 'create' ? 'Create Pocket' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}