<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories (Web)
     */
    public function index(Request $request)
    {
        $categories = $request->user()
            ->categories()
            ->orderBy('order')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * API endpoint for categories
     * Returns JSON for use in filters and other components
     */
    public function apiIndex(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([], 401);
            }

            // Get categories - both user-specific and default ones
            $categories = Category::select('id', 'name', 'icon', 'color', 'type')
                ->where(function($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->orWhereNull('user_id');
                })
                ->where('is_active', 1)
                ->orderBy('name')
                ->get();

            // Format the data
            $formattedCategories = $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'icon' => $category->icon ?? 'mdi:folder',
                    'color' => $category->color ?? '#5CB85C',
                    'type' => $category->type ?? 'expense',
                ];
            });

            return response()->json($formattedCategories);
            
        } catch (\Exception $e) {
            \Log::error('Category API error: ' . $e->getMessage());
            // Return empty array on error to prevent frontend crashes
            return response()->json([]);
        }
    }

    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string',
            'type' => 'required|in:expense,income,savings',
        ]);

        $category = $request->user()->categories()->create([
            'name' => $validated['name'],
            'icon' => $validated['icon'] ?? 'mdi:folder',
            'color' => $validated['color'] ?? '#5CB85C',
            'type' => $validated['type'],
            'order' => $request->user()->categories()->count() + 1,
            'is_active' => 1,
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Category created successfully!');
    }

    public function show(Category $category)
    {
        if ($category->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Categories/Show', [
            'category' => $category->load('transactions')
        ]);
    }

    public function edit(Category $category)
    {
        if ($category->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Categories/Edit', [
            'category' => $category
        ]);
    }

    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string',
            'type' => 'required|in:expense,income,savings',
        ]);

        $category->update($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Category updated successfully!');
    }

    public function destroy(Category $category)
    {
        if ($category->user_id !== auth()->id()) {
            abort(403);
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully!');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['categories'] as $categoryData) {
            Category::where('id', $categoryData['id'])
                ->where('user_id', auth()->id())
                ->update(['order' => $categoryData['order']]);
        }

        return response()->json(['message' => 'Categories reordered successfully']);
    }
}