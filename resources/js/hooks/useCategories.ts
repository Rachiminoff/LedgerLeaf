import { useState } from 'react';
import axios from 'axios';

interface Category {
    id: number;
    name: string;
    icon: string;
    color: string;
    type: 'expense' | 'income' | 'savings';
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data || []);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch categories';
            setError(message);
            console.error('Failed to fetch categories:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getCategoryById = (id: number): Category | undefined => {
        return categories.find(category => category.id === id);
    };

    const getCategoryByName = (name: string): Category | undefined => {
        return categories.find(category => category.name === name);
    };

    const getCategoriesByType = (type: 'expense' | 'income' | 'savings'): Category[] => {
        return categories.filter(category => category.type === type);
    };

    const getExpenseCategories = (): Category[] => {
        return categories.filter(category => category.type === 'expense');
    };

    const getIncomeCategories = (): Category[] => {
        return categories.filter(category => category.type === 'income');
    };

    const getSavingsCategories = (): Category[] => {
        return categories.filter(category => category.type === 'savings');
    };

    return { 
        categories, 
        loading, 
        error,
        fetchCategories,
        getCategoryById,
        getCategoryByName,
        getCategoriesByType,
        getExpenseCategories,
        getIncomeCategories,
        getSavingsCategories,
    };
}