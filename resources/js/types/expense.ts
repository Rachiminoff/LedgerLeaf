// resources/js/types/expense.ts

export interface Expense {
    id: number;
    user_id: number;
    category_id: number;
    pocket_id: number;
    amount: number;
    description: string;
    merchant?: string;
    payment_method?: string;
    expense_date: string;
    receipt_url?: string;
    tags?: string[];
    notes?: string;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    // Relationships
    category?: Category;
    pocket?: Pocket;
}

export interface Category {
    id: number;
    name: string;
    icon: string;
    color: string;
    type: 'expense' | 'income' | 'savings';
}

export interface Pocket {
    id: number;
    name: string;
    icon: string;
    color: string;
    balance: number;
    allocated: number;
    spent: number;
}

export interface ExpenseSummary {
    today: number;
    this_week: number;
    this_month: number;
    average_daily: number;
    largest_expense: number;
    total_expenses: number;
    trends: {
        today: number;
        this_week: number;
        this_month: number;
    };
}

export interface ExpenseFilters {
    date_range: 'today' | 'this_week' | 'this_month' | 'last_3_months' | 'custom';
    start_date?: string;
    end_date?: string;
    pocket_id?: number;
    category_id?: number;
    payment_method?: string;
    min_amount?: number;
    max_amount?: number;
    search?: string;
    sort_by: 'newest' | 'oldest' | 'highest' | 'lowest';
    is_archived: boolean;
}

export interface ExpenseInsight {
    id: string;
    type: 'positive' | 'neutral' | 'warning';
    title: string;
    description: string;
    icon: string;
}

export interface ExpenseStats {
    topCategories: Array<{
        name: string;
        total: number;
        percentage: number;
        color: string;
    }>;
    monthlyTrend: Array<{
        month: string;
        amount: number;
    }>;
    dailySpending: Array<{
        day: string;
        amount: number;
    }>;
    pocketDistribution: Array<{
        name: string;
        amount: number;
        percentage: number;
        color: string;
    }>;
}