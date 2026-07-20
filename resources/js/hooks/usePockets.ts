import { useState } from 'react';
import axios from 'axios';

const API_URL = '/api';

interface PocketRecord {
    id: number;
    name: string;
    icon?: string;
    color?: string;
    allocated?: number;
    spent?: number;
    remaining?: number;
    progress?: number;
    is_archived?: boolean;
    description?: string;
    [key: string]: unknown;
}

interface PocketFilters {
    search: string;
    status: string;
    sort_by: string;
    sort_order: string;
}

export function usePockets() {
    const [loading, setLoading] = useState(false);
    const [pockets, setPockets] = useState<PocketRecord[]>([]);
    const [filters, setFilters] = useState<PocketFilters>({
        search: '',
        status: 'all',
        sort_by: 'name',
        sort_order: 'asc',
    });

    const fetchPockets = async (filterParams: any = {}) => {
        setLoading(true);
        try {
            const params = { ...filters, ...filterParams };
            const response = await axios.get(`${API_URL}/pockets`, { params });
            setPockets(response.data);
        } catch (error) {
            console.error('Failed to fetch pockets:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            status: 'all',
            sort_by: 'name',
            sort_order: 'asc',
        });
    };

    return {
        pockets,
        loading,
        filters,
        setFilters,
        resetFilters,
        fetchPockets,
    };
}