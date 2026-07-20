import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertCircle } from 'lucide-react';
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

    useEffect(() => {
        setError(null);
        
        if (pocket && mode === 'edit') {
            setFormData({
                name: pocket.name || '',
                description: pocket.description || '',
                icon: pocket.icon || 'mdi:folder',
                color: pocket.color || '#5CB85C',
                allocated: '', // Empty in edit mode - amount is not editable
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
        
        // Validate: Cannot exceed safe balance when creating
        if (mode === 'create' && allocatedAmount > safeBalance) {
            setError(`Amount exceeds safe balance of ₱${safeBalance.toFixed(2)}`);
            return;
        }
        
        // Prepare data for save
        const saveData: any = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            icon: formData.icon,
            color: formData.color,
        };

        // Only include allocated for create mode
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
        '#5CB85C', '#3B82F6', '#EF4444', '#F4B400', '#8B5CF6', '#EC4899', '#06B6D4'
    ];

    const iconOptions = [
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
    ];

    const allocatedAmount = parseFloat(formData.allocated) || 0;
    const isOverSafeBalance = mode === 'create' && allocatedAmount > safeBalance;

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
                                {/* Safe Balance Display - Only show in create mode */}
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

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">Icon</label>
                                    <div className="grid grid-cols-7 gap-2 max-h-32 overflow-y-auto">
                                        {iconOptions.map((icon) => (
                                            <button
                                                key={icon.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon: icon.value })}
                                                className={`p-2 rounded-lg transition-all flex flex-col items-center gap-1 ${
                                                    formData.icon === icon.value
                                                        ? 'bg-[#5CB85C] text-black'
                                                        : 'bg-[#171717] hover:bg-[#242424] text-[#9A9A9A] hover:text-white'
                                                }`}
                                                title={icon.label}
                                            >
                                                <Icon icon={icon.value} className="w-5 h-5" />
                                                <span className="text-[8px]">{icon.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">Color</label>
                                    <div className="flex gap-2">
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

                                {/* Amount Input - Only show in create mode */}
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

                                {/* Show current allocation in edit mode (read-only) */}
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