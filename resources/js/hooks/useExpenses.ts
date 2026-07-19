// resources/js/hooks/useExpenses.ts
import { useState } from 'react';
import axios from 'axios';

const API_URL = '/api';

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
            const response = await axios.get(`${API_URL}/expenses`, { params: filters });
            console.log('📦 API Response:', response.data);
            
            // ✅ Set expenses data
            setExpenses(response.data.data || []);
            setPagination(response.data.meta || null);
            
            // ✅ Set summary, stats, insights from response
            if (response.data.summary) {
                console.log('📊 Setting summary:', response.data.summary);
                setSummary(response.data.summary);
            }
            if (response.data.stats) {
                console.log('📈 Setting stats:', response.data.stats);
                setStats(response.data.stats);
            }
            if (response.data.insights) {
                setInsights(response.data.insights);
            }
        } catch (error) {
            console.error('❌ Failed to fetch expenses:', error);
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    const createExpense = async (data: any) => {
        try {
            const response = await axios.post(`${API_URL}/expenses`, data);
            await fetchExpenses();
            return response.data;
        } catch (error: any) {
            console.error('Failed to create expense:', error);
            throw error;
        }
    };

    const updateExpense = async (id: number, data: any) => {
        try {
            const response = await axios.put(`${API_URL}/expenses/${id}`, data);
            await fetchExpenses();
            return response.data;
        } catch (error: any) {
            console.error('Failed to update expense:', error);
            throw error;
        }
    };

    const archiveExpense = async (id: number) => {
        try {
            const response = await axios.patch(`${API_URL}/expenses/${id}/archive`);
            await fetchExpenses();
            return response.data;
        } catch (error: any) {
            console.error('Failed to archive expense:', error);
            throw error;
        }
    };

    const deleteExpense = async (id: number) => {
        try {
            const response = await axios.delete(`${API_URL}/expenses/${id}`);
            await fetchExpenses();
            return response.data;
        } catch (error: any) {
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