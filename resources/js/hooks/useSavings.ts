import { useState } from 'react'
import axios from 'axios'

const API_URL = '/api'

export function useSavings() {
    const [goals, setGoals] = useState([])
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(false)
    const [summary, setSummary] = useState(null)
    const [error, setError] = useState<string | null>(null)

    const fetchGoals = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${API_URL}/savings-goals`)
            setGoals(response.data.goals || [])
            setSummary(response.data.summary || null)
            setTransactions(response.data.recent_transactions || [])
            return response.data
        } catch (error) {
            console.error('Failed to fetch savings goals:', error)
            setError('Failed to load savings goals')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const createGoal = async (data: any) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post(`${API_URL}/savings-goals`, data)
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create savings goal'
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const updateGoal = async (id: number, data: any) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.put(`${API_URL}/savings-goals/${id}`, data)
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update savings goal'
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const archiveGoal = async (id: number) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.patch(`${API_URL}/savings-goals/${id}/archive`)
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to archive savings goal'
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const deleteGoal = async (id: number) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.delete(`${API_URL}/savings-goals/${id}`)
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete savings goal'
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const depositFunds = async (id: number, data: any) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post(`${API_URL}/savings-goals/${id}/deposit`, data)
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to deposit funds'
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const withdrawFunds = async (id: number, data: any) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post(`${API_URL}/savings-goals/${id}/withdraw`, data)
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to withdraw funds'
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const refundGoalFunds = async (id: number, amount: number) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post(`${API_URL}/savings-goals/${id}/refund`, { amount })
            return response.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to refund funds'
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const fetchTransactions = async (filters: any = {}) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${API_URL}/savings-goals/transactions`, { params: filters })
            setTransactions(response.data.data || [])
            return response.data
        } catch (error: any) {
            console.error('Failed to fetch transactions:', error)
            setError('Failed to load transactions')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const clearError = () => {
        setError(null)
    }

    return {
        goals,
        transactions,
        loading,
        summary,
        error,
        fetchGoals,
        createGoal,
        updateGoal,
        archiveGoal,
        deleteGoal,
        depositFunds,
        withdrawFunds,
        refundGoalFunds,
        fetchTransactions,
        clearError,
    }
}