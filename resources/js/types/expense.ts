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
    type?: 'expense' | 'income' | 'transfer';
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    // Relationships
    category?: Category;
    pocket?: Pocket;
    category_name?: string;
    pocket_name?: string;
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
    is_archived?: boolean;
    page?: number;
    per_page?: number;
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

// ─── Archived Expenses Types ─────────────────────────────────────

export interface ArchivedExpense extends Expense {
    archived_at: string;
    archived_by?: number;
    restored_at?: string | null;
    restored_by?: number | null;
    deletion_reason?: string;
}

export interface ArchivedExpenseFilters {
    search?: string;
    date_from?: string;
    date_to?: string;
    category_id?: number;
    pocket_id?: number;
    min_amount?: number;
    max_amount?: number;
    sort_by: 'newest' | 'oldest' | 'highest' | 'lowest';
    page?: number;
    per_page?: number;
}

export interface ArchivedExpenseStats {
    total_archived: number;
    total_amount: number;
    average_amount: number;
    oldest_archive_date: string;
    newest_archive_date: string;
    archived_by_category: Array<{
        category_name: string;
        count: number;
        total_amount: number;
    }>;
    archived_by_month: Array<{
        month: string;
        count: number;
        total_amount: number;
    }>;
}

// ─── Expense API Response Types ─────────────────────────────────

export interface ExpenseApiResponse {
    data: Expense[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}

export interface ArchivedExpenseApiResponse {
    data: ArchivedExpense[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    stats: ArchivedExpenseStats;
}

// ─── Form Types ──────────────────────────────────────────────────

export interface ExpenseFormData {
    amount: number;
    description: string;
    category_id: number;
    pocket_id: number;
    expense_date: string;
    merchant?: string;
    payment_method?: string;
    notes?: string;
    tags?: string[];
    receipt?: File | null;
}

export interface ExpenseValidationErrors {
    amount?: string[];
    description?: string[];
    category_id?: string[];
    pocket_id?: string[];
    expense_date?: string[];
    merchant?: string[];
    payment_method?: string[];
    notes?: string[];
    tags?: string[];
    receipt?: string[];
}