import { useState } from 'react';
import axios from 'axios';

// Set up axios defaults
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const API_URL = '/api';

interface BudgetSummary {
    safe_balance?: number;
    allocated_balance?: number;
    remaining_balance?: number;
    monthly_budget?: number;
    total_pockets?: number;
    budget_health?: number;
    budget_health_label?: string;
    [key: string]: unknown;
}

interface BudgetStats {
    [key: string]: unknown;
}

interface BudgetInsight {
    id?: number;
    message?: string;
    icon?: string;
    type?: 'positive' | 'warning' | 'neutral';
    [key: string]: unknown;
}

interface RecentActivityItem {
    [key: string]: unknown;
}

export function useBudget() {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<BudgetSummary | null>(null);
    const [stats, setStats] = useState<BudgetStats | null>(null);
    const [insights, setInsights] = useState<BudgetInsight[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);

    const fetchBudgetData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/budget/data`);
            setSummary(response.data.summary);
            setStats(response.data.stats);
            setInsights(response.data.insights || []);
            setRecentActivity(response.data.recent_activity || []);
        } catch (error: any) {
            console.error('Failed to fetch budget data:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createPocket = async (data: any) => {
        try {
            const response = await axios.post(`${API_URL}/pockets`, data);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 422) {
                const errorData = error.response.data;
                if (errorData.errors) {
                    const firstError = Object.values(errorData.errors)[0];
                    const message = Array.isArray(firstError) ? firstError[0] : 'Validation error';
                    throw new Error(message);
                }
                throw new Error(errorData.message || 'Validation failed');
            }
            console.error('Failed to create pocket:', error);
            throw error;
        }
    };

    const updatePocket = async (id: number, data: any) => {
        try {
            const response = await axios.put(`${API_URL}/pockets/${id}`, data);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 422) {
                const errorData = error.response.data;
                if (errorData.errors) {
                    const firstError = Object.values(errorData.errors)[0];
                    const message = Array.isArray(firstError) ? firstError[0] : 'Validation error';
                    throw new Error(message);
                }
                throw new Error(errorData.message || 'Validation failed');
            }
            console.error('Failed to update pocket:', error);
            throw error;
        }
    };

    const archivePocket = async (id: number) => {
        try {
            const response = await axios.patch(`${API_URL}/pockets/${id}/archive`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to archive pocket:', error);
            throw error;
        }
    };

    const deletePocket = async (id: number) => {
        try {
            const response = await axios.delete(`${API_URL}/pockets/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to delete pocket:', error);
            throw error;
        }
    };

    const allocateFunds = async (pocketId: number, amount: number) => {
        try {
            const response = await axios.post(`${API_URL}/budget/allocate`, {
                pocket_id: pocketId,
                amount,
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to allocate funds:', error);
            throw error;
        }
    };

    const transferFunds = async (fromPocketId: number, toPocketId: number, amount: number) => {
        try {
            const response = await axios.post(`${API_URL}/budget/transfer`, {
                from_pocket_id: fromPocketId,
                to_pocket_id: toPocketId,
                amount,
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to transfer funds:', error);
            throw error;
        }
    };

    const refundPocket = async (pocketId: number) => {
        try {
            const response = await axios.post(`${API_URL}/pockets/refund`, {
                pocket_id: pocketId,
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to refund pocket:', error);
            throw error;
        }
    };

    return {
        loading,
        summary,
        stats,
        insights,
        recentActivity,
        fetchBudgetData,
        createPocket,
        updatePocket,
        archivePocket,
        deletePocket,
        allocateFunds,
        transferFunds,
        refundPocket,
    };
}