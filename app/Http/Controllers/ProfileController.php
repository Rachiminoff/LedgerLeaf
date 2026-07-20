<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ProfileController extends Controller
{
    /**
     * Display the user's profile page.
     *
     * @param Request $request
     * @return InertiaResponse
     */
    public function index(Request $request): InertiaResponse
    {
        $user = $request->user();

        $profileData = $this->getProfileData($user);

        return Inertia::render('Profile/Index', $profileData);
    }

    /**
     * Get profile data for the authenticated user.
     *
     * @param User $user
     * @return array
     */
    private function getProfileData(User $user): array
    {
        $activePockets = $user->pockets()
            ->where('is_archived', false)
            ->whereNull('deleted_at')
            ->count();

        $totalExpenses = $user->expenses()
            ->where('is_archived', false)
            ->sum('amount');

        $activeSavingsGoals = $user->savingsGoals()
            ->where('is_archived', false)
            ->where('is_completed', false)
            ->count();

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'safe_balance' => $user->safe_balance ?? 0,
                'total_balance' => $user->total_balance ?? 0,
                'created_at' => $user->created_at,
                'member_since' => $user->created_at->format('F Y'),
            ],
            'statistics' => [
                'safe_balance' => $user->safe_balance ?? 0,
                'total_balance' => $user->total_balance ?? 0,
                'active_pockets' => $activePockets,
                'total_expenses' => $totalExpenses,
                'active_savings_goals' => $activeSavingsGoals,
            ],
        ];
    }

    /**
     * Update user profile information.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $request->user()->id],
            ]);

            $user = $request->user();
            $user->update($validated);

            Log::info('User profile updated', ['user_id' => $user->id]);

            return response()->json([
                'message' => 'Profile updated successfully.',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $exception) {
            return response()->json([
                'errors' => $exception->errors(),
            ], 422);
        } catch (\Exception $exception) {
            Log::error('Profile update error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to update profile. Please try again.',
            ], 500);
        }
    }

    /**
     * Update user password.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updatePassword(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'current_password' => ['required', 'string'],
                'password' => ['required', 'string', Password::min(8), 'confirmed'],
            ]);

            $user = $request->user();

            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'errors' => [
                        'current_password' => ['The current password is incorrect.'],
                    ],
                ], 422);
            }

            $user->update([
                'password' => Hash::make($validated['password']),
            ]);

            Log::info('User password changed', ['user_id' => $user->id]);

            return response()->json([
                'message' => 'Password updated successfully.',
            ]);
        } catch (\Illuminate\Validation\ValidationException $exception) {
            return response()->json([
                'errors' => $exception->errors(),
            ], 422);
        } catch (\Exception $exception) {
            Log::error('Password update error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to update password. Please try again.',
            ], 500);
        }
    }

    /**
     * Update user settings.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateSettings(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'dark_theme' => ['boolean'],
                'email_notifications' => ['boolean'],
            ]);

            $user = $request->user();
            $user->update($validated);

            Log::info('User settings updated', ['user_id' => $user->id]);

            return response()->json([
                'message' => 'Settings updated successfully.',
                'settings' => [
                    'dark_theme' => $user->dark_theme,
                    'email_notifications' => $user->email_notifications,
                ],
            ]);
        } catch (\Exception $exception) {
            Log::error('Settings update error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to update settings. Please try again.',
            ], 500);
        }
    }

/**
 * Delete user account.
 *
 * @param Request $request
 * @return JsonResponse
 */
public function destroy(Request $request): JsonResponse
{
    try {
        $validated = $request->validate([
            'confirmation' => ['required', 'string', 'in:DELETE EVERYTHING'],
            'password' => ['required', 'string'],
        ]);

        $user = $request->user();

        // Verify password
        if (!Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'errors' => [
                    'password' => ['The password is incorrect.'],
                ],
            ], 422);
        }

        $userId = $user->id;

        // Disable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // List of tables to check and delete from
        $tablesToCheck = [
            'transactions',
            'expenses', 
            'allocations',
            'budgets',
            'savings_goals',
            'pockets',
            'categories',
            'notifications',
            'audit_logs',
            'bill_reminders',
            'user_balances',
        ];

        // Try to delete from each table if it exists
        foreach ($tablesToCheck as $table) {
            try {
                // Check if table exists by trying to query it
                $tableExists = \Schema::hasTable($table);
                
                if ($tableExists) {
                    // Check if user_id column exists
                    $hasUserId = \Schema::hasColumn($table, 'user_id');
                    
                    if ($hasUserId) {
                        \DB::table($table)->where('user_id', $userId)->delete();
                    }
                }
            } catch (\Exception $e) {
                // Log but continue - some tables might not exist
                Log::warning("Could not delete from {$table}: " . $e->getMessage());
            }
        }

        // Delete the user
        \DB::table('users')->where('id', $userId)->delete();

        // Re-enable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Log::info('User account deleted', [
            'user_id' => $userId,
            'email' => $user->email,
        ]);

        // Logout the user
        auth()->logout();

        // Invalidate the session
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Account deleted successfully.',
        ]);
    } catch (\Illuminate\Validation\ValidationException $exception) {
        return response()->json([
            'errors' => $exception->errors(),
        ], 422);
    } catch (\Exception $exception) {
        Log::error('Account deletion error: ' . $exception->getMessage());

        return response()->json([
            'error' => 'Failed to delete account: ' . $exception->getMessage(),
        ], 500);
    }
}

    /**
     * Get updated statistics for the profile.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getStatistics(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $activePockets = $user->pockets()
                ->where('is_archived', false)
                ->whereNull('deleted_at')
                ->count();

            $totalExpenses = $user->expenses()
                ->where('is_archived', false)
                ->sum('amount');

            $activeSavingsGoals = $user->savingsGoals()
                ->where('is_archived', false)
                ->where('is_completed', false)
                ->count();

            return response()->json([
                'safe_balance' => $user->safe_balance ?? 0,
                'total_balance' => $user->total_balance ?? 0,
                'active_pockets' => $activePockets,
                'total_expenses' => $totalExpenses,
                'active_savings_goals' => $activeSavingsGoals,
            ]);
        } catch (\Exception $exception) {
            Log::error('Statistics fetch error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to fetch statistics.',
            ], 500);
        }
    }
}