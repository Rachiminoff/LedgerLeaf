<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

/**
 * SavingsSheet exports the savings goals data.
 */
class SavingsSheet implements FromArray, WithHeadings, WithTitle
{
    /** @var array The export data */
    protected array $data;

    /**
     * Create a new SavingsSheet instance.
     *
     * @param array $data The data to export
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Get the array representation of the savings data.
     *
     * @return array
     */
    public function array(): array
    {
        $rows = [];

        if (empty($this->data['savings']) || $this->data['savings']->isEmpty()) {
            return [['No savings goals created yet.']];
        }

        foreach ($this->data['savings'] as $goal) {
            $progress = $goal->target_amount > 0
                ? round(($goal->current_amount / $goal->target_amount) * 100, 1)
                : 0;

            $rows[] = [
                $goal->name,
                number_format($goal->target_amount, 2),
                number_format($goal->current_amount, 2),
                $progress . '%',
                $goal->is_completed ? 'Completed' : 'In Progress',
            ];
        }

        return $rows;
    }

    /**
     * Get the sheet title.
     *
     * @return string
     */
    public function title(): string
    {
        return 'Savings';
    }

    /**
     * Get the column headings.
     *
     * @return array
     */
    public function headings(): array
    {
        return ['Name', 'Target', 'Current', 'Progress', 'Status'];
    }
}