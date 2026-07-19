<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

/**
 * ExpensesSheet exports the expense data.
 */
class ExpensesSheet implements FromArray, WithHeadings, WithTitle
{
    /** @var array The export data */
    protected array $data;

    /**
     * Create a new ExpensesSheet instance.
     *
     * @param array $data The data to export
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Get the array representation of the expense data.
     *
     * @return array
     */
    public function array(): array
    {
        $rows = [];

        if (empty($this->data['expenses']) || $this->data['expenses']->isEmpty()) {
            return [['No expenses recorded in this period.']];
        }

        foreach ($this->data['expenses'] as $expense) {
            $rows[] = [
                $expense->expense_date,
                $expense->description,
                $expense->pocket?->name ?? 'Uncategorized',
                number_format($expense->amount, 2),
            ];
        }

        // Add total row
        $rows[] = [
            'TOTAL',
            '',
            '',
            number_format($this->data['summary']['total_expenses'] ?? 0, 2),
        ];

        return $rows;
    }

    /**
     * Get the sheet title.
     *
     * @return string
     */
    public function title(): string
    {
        return 'Expenses';
    }

    /**
     * Get the column headings.
     *
     * @return array
     */
    public function headings(): array
    {
        return ['Date', 'Description', 'Pocket', 'Amount'];
    }
}