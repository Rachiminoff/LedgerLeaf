// resources/js/hooks/useExpenseFilters.ts
import { useState } from 'react';

export function useExpenseFilters() {
    const [filters, setFilters] = useState({
        date_range: 'this_month',
        search: '',
        sort_by: 'newest',
        page: 1,
        per_page: 15,
    });

    const resetFilters = () => {
        setFilters({
            date_range: 'this_month',
            search: '',
            sort_by: 'newest',
            page: 1,
            per_page: 15,
        });
    };

    const updateFilters = (newFilters: any) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || 1,
        }));
    };

    return {
        filters,
        setFilters: updateFilters,
        resetFilters,
    };
}