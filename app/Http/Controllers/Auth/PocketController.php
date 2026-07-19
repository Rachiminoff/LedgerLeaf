<?php

namespace App\Http\Controllers;

use App\Models\Pocket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PocketController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Get all pockets with filters.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Pocket::where('user_id', $user->id);

        // Filter by status
        if ($request->status === 'archived') {
            $query->onlyTrashed();
        } elseif ($request->status === 'active') {
            $query->whereNull('deleted_at')->where('is_archived', false);
        } elseif ($request->status === 'over_budget') {
            $query->whereNull('deleted_at')->whereRaw('spent > allocated');
        } elseif ($request->status === 'under_budget') {
            $query->whereNull('deleted_at')->whereRaw('spent < allocated');
        } else {
            $query->whereNull('deleted_at')->where('is_archived', false);
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Sort
        $sortBy = $request->sort_by ?? 'name';
        $sortOrder = $request->sort_order ?? 'asc';
        $query->orderBy($sortBy, $sortOrder);

        $pockets = $query->get();

        // Calculate progress for each pocket
        $pockets->each(function ($pocket) {
            $pocket->progress = $pocket->allocated > 0 
                ? ($pocket->spent / $pocket->allocated) * 100 
                : 0;
            $pocket->remaining = $pocket->allocated - $pocket->spent;
        });

        return response()->json($pockets);
    }

    /**
     * Create a new pocket.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string',
            'allocated' => 'nullable|numeric|min:0',
        ]);

        $user = $request->user();

        // Check for duplicate name
        if (Pocket::where('user_id', $user->id)->where('name', $validated['name'])->exists()) {
            return response()->json(['message' => 'A pocket with this name already exists'], 422);
        }

        DB::transaction(function () use ($user, $validated) {
            $pocket = Pocket::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'icon' => $validated['icon'] ?? 'mdi:folder',
                'color' => $validated['color'] ?? '#5CB85C',
                'allocated' => $validated['allocated'] ?? 0,
                'balance' => $validated['allocated'] ?? 0,
                'spent' => 0,
                'is_default' => false,
            ]);

            // If there's an initial allocation, deduct from safe balance
            if ($validated['allocated'] > 0) {
                $user->safe_balance -= $validated['allocated'];
                $user->save();

                // Create allocation record
                \App\Models\Allocation::create([
                    'user_id' => $user->id,
                    'pocket_id' => $pocket->id,
                    'amount' => $validated['allocated'],
                    'type' => 'allocate',
                    'description' => "Allocated ₱" . number_format($validated['allocated'], 2) . " to {$pocket->name}",
                ]);
            }
        });

        return response()->json(['message' => 'Pocket created successfully'], 201);
    }

    /**
     * Update a pocket.
     */
    public function update(Request $request, Pocket $pocket)
    {
        if ($pocket->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string',
        ]);

        $pocket->update($validated);

        return response()->json(['message' => 'Pocket updated successfully']);
    }

    /**
     * Archive a pocket (soft delete).
     */
    public function archive(Pocket $pocket)
    {
        if ($pocket->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $pocket->delete();

        return response()->json(['message' => 'Pocket archived successfully']);
    }

    /**
     * Restore an archived pocket.
     */
    public function restore($id)
    {
        $pocket = Pocket::withTrashed()->find($id);
        
        if (!$pocket || $pocket->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $pocket->restore();

        return response()->json(['message' => 'Pocket restored successfully']);
    }

    /**
     * Permanently delete a pocket.
     */
    public function destroy(Pocket $pocket)
    {
        if ($pocket->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Force delete
        $pocket->forceDelete();

        return response()->json(['message' => 'Pocket deleted successfully']);
    }
}