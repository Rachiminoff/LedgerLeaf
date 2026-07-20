// resources/js/hooks/useTransactions.ts
import { useState } from 'react';
import axios from 'axios';

const API_URL = '/api';

interface TransactionFilters {
    search?: string;
    action?: string;
    table_name?: string;
    date_range?: string;
    sort_by?: string;
    page?: number;
    per_page?: number;
}

interface TransactionRecord {
    id: number;
    created_at?: string;
    action?: string;
    [key: string]: unknown;
}

interface TransactionSummary {
    total?: number;
    by_action?: Array<{ action?: string }>;
    [key: string]: unknown;
}

interface TransactionPagination {
    last_page?: number;
    from?: number;
    to?: number;
    total?: number;
    current_page?: number;
    [key: string]: unknown;
}

export function useTransactions() {
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<TransactionSummary | null>(null);
    const [pagination, setPagination] = useState<TransactionPagination | null>(null);
    const [filters, setFilters] = useState<TransactionFilters>({
        date_range: 'this_month',
        search: '',
        sort_by: 'newest',
        page: 1,
        per_page: 15,
    });

    const fetchTransactions = async (newFilters: Partial<TransactionFilters> = {}) => {
        setLoading(true);
        try {
            const params = { ...filters, ...newFilters };
            const response = await axios.get(`${API_URL}/transactions`, { params });
            
            setTransactions(response.data.data || []);
            setPagination(response.data.meta || null);
            setSummary(response.data.summary || null);
            
            // Update filters
            setFilters(params);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        const defaultFilters = {
            date_range: 'this_month',
            search: '',
            sort_by: 'newest',
            page: 1,
            per_page: 15,
        };
        setFilters(defaultFilters);
        fetchTransactions(defaultFilters);
    };

    return {
        transactions,
        loading,
        summary,
        pagination,
        filters,
        fetchTransactions,
        resetFilters,
        setFilters,
    };
}