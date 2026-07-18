import React from 'react'
import { Icon } from '@iconify/react'

interface Category {
  id: number
  name: string
  icon: string
  color: string
  allocated: number
  spent: number
  remaining: number
  budget_id: number
  category_id: number
  budget_name: string
}

interface BudgetCategoriesProps {
  categories: Category[]
  onManage?: () => void
}

export const BudgetCategories: React.FC<BudgetCategoriesProps> = ({
  categories,
  onManage,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-white">Budget Categories</h3>
        <button
          onClick={onManage}
          className="text-sm text-[#9A9A9A] hover:text-white transition-colors duration-200"
        >
          Manage
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-[#9A9A9A]">No budget categories yet</p>
          <button className="text-sm text-[#5CB85C] hover:text-[#6FCF70] transition-colors mt-2">
            Create your first budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category) => {
            const percentage = Math.round((category.spent / category.allocated) * 100) || 0
            const isOverBudget = percentage > 100

            return (
              <div
                key={category.id}
                className="bg-[#1A1A1A] rounded-xl p-4 border border-[#242424] hover:border-[#5CB85C] transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon icon={category.icon} className="h-4 w-4" style={{ color: category.color }} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-white truncate block">{category.name}</span>
                      <span className="text-[10px] text-[#9A9A9A] truncate block">{category.budget_name}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium flex-shrink-0 ml-2 ${
                    isOverBudget ? 'text-[#FF5A5A]' : percentage > 80 ? 'text-[#FFB74D]' : 'text-[#9A9A9A]'
                  }`}>
                    {isOverBudget ? 'Over Budget' : `${percentage}%`}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#9A9A9A]">Spent</span>
                    <span className="text-white">{formatCurrency(category.spent)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#111111] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: isOverBudget ? '#FF5A5A' : percentage > 80 ? '#FFB74D' : category.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#9A9A9A]">Remaining</span>
                    <span className={isOverBudget ? 'text-[#FF5A5A]' : 'text-white'}>
                      {isOverBudget ? `-${formatCurrency(Math.abs(category.remaining))}` : formatCurrency(category.remaining)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}