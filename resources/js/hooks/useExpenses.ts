// resources/js/hooks/useExpenses.ts
import { useState } from 'react';
import axios from 'axios';

export function useExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const [stats, setStats] = useState(null);
    const [insights, setInsights] = useState([]);
    const [pagination, setPagination] = useState(null);

    const fetchExpenses = async (filters: any = {}) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/expenses', { params: filters });
            setExpenses(response.data.data || []);
            setPagination(response.data.meta || null);
            setSummary(response.data.summary || null);
            setStats(response.data.stats || null);
            setInsights(response.data.insights || []);
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const createExpense = async (data: any) => {
        try {
            const response = await axios.post('/api/expenses', data);
            return response.data;
        } catch (error) {
            console.error('Failed to create expense:', error);
            throw error;
        }
    };

    const updateExpense = async (id: number, data: any) => {
        try {
            const response = await axios.put(`/api/expenses/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to update expense:', error);
            throw error;
        }
    };

    const archiveExpense = async (id: number) => {
        try {
            const response = await axios.patch(`/api/expenses/${id}/archive`);
            return response.data;
        } catch (error) {
            console.error('Failed to archive expense:', error);
            throw error;
        }
    };

    const deleteExpense = async (id: number) => {
        try {
            const response = await axios.delete(`/api/expenses/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete expense:', error);
            throw error;
        }
    };

    return {
        expenses,
        loading,
        summary,
        stats,
        insights,
        pagination,
        fetchExpenses,
        createExpense,
        updateExpense,
        archiveExpense,
        deleteExpense,
    };
}