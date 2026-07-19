import { useState } from 'react';
import axios from 'axios';

const API_URL = '/api';

export function usePockets() {
    const [loading, setLoading] = useState(false);
    const [pockets, setPockets] = useState([]);
    const [filters, setFilters] = useState({
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