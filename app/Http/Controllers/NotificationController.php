<?php
// app/Http/Controllers/NotificationController.php

namespace App\Http\Controllers;

use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class NotificationController extends Controller
{
    /**
     * Display the notifications page.
     *
     * @param Request $request
     * @return InertiaResponse
     */
    public function index(Request $request): InertiaResponse
    {
        $user = $request->user();

        // Get unread count
        $unreadCount = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        // Get recent notifications (last 50)
        $notifications = $this->getUserNotifications($user);

        // Get summary stats
        $summary = $this->getSummary($user);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
            'summary' => $summary,
        ]);
    }

    /**
     * Get notifications for the authenticated user (API endpoint).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getNotifications(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $category = $request->input('category', 'all');
            $limit = $request->input('limit', 50);

            $notifications = Notification::where('user_id', $user->id)
                ->category($category)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            $grouped = $this->groupNotifications($notifications);

            return response()->json([
                'notifications' => $grouped,
            ]);
        } catch (\Exception $exception) {
            Log::error('Get notifications error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to fetch notifications.',
            ], 500);
        }
    }

    /**
     * Get notifications for the authenticated user (helper).
     *
     * @param mixed $user
     * @param string $category
     * @return array
     */
    private function getUserNotifications($user, string $category = 'all'): array
    {
        $notifications = Notification::where('user_id', $user->id)
            ->category($category)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return $this->groupNotifications($notifications);
    }

    /**
     * Group notifications by date.
     *
     * @param \Illuminate\Support\Collection $notifications
     * @return array
     */
    private function groupNotifications($notifications): array
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        $weekStart = Carbon::now()->startOfWeek();

        $groups = [
            'today' => [],
            'yesterday' => [],
            'this_week' => [],
            'older' => [],
        ];

        foreach ($notifications as $notification) {
            $date = $notification->created_at->startOfDay();

            if ($date->eq($today)) {
                $groups['today'][] = $this->formatNotification($notification);
            } elseif ($date->eq($yesterday)) {
                $groups['yesterday'][] = $this->formatNotification($notification);
            } elseif ($date->gte($weekStart)) {
                $groups['this_week'][] = $this->formatNotification($notification);
            } else {
                $groups['older'][] = $this->formatNotification($notification);
            }
        }

        // Remove empty groups
        return array_filter($groups, fn($group) => count($group) > 0);
    }

    /**
     * Format a single notification for frontend.
     *
     * @param Notification $notification
     * @return array
     */
    private function formatNotification(Notification $notification): array
    {
        return [
            'id' => $notification->id,
            'category' => $notification->category,
            'title' => $notification->title,
            'message' => $notification->message,
            'is_read' => $notification->is_read,
            'icon' => $notification->category_icon,
            'color' => $notification->category_color,
            'created_at' => $notification->created_at->diffForHumans(),
            'created_at_raw' => $notification->created_at->toISOString(),
            'data' => $notification->data,
        ];
    }

    /**
     * Get notification summary stats.
     *
     * @param mixed $user
     * @return array
     */
    private function getSummary($user): array
    {
        $total = Notification::where('user_id', $user->id)->count();
        $unread = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        $budgetAlerts = Notification::where('user_id', $user->id)
            ->where('category', 'budget')
            ->where('is_read', false)
            ->count();

        $savingsMilestones = Notification::where('user_id', $user->id)
            ->where('category', 'savings')
            ->where('is_read', false)
            ->count();

        $monthlyInsights = Notification::where('user_id', $user->id)
            ->where('category', 'monthly')
            ->where('is_read', false)
            ->count();

        return [
            'total' => $total,
            'unread' => $unread,
            'budget_alerts' => $budgetAlerts,
            'savings_milestones' => $savingsMilestones,
            'monthly_insights' => $monthlyInsights,
        ];
    }

    /**
     * Mark a notification as read.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function markAsRead(Request $request, int $id): JsonResponse
    {
        try {
            $notification = Notification::where('user_id', $request->user()->id)
                ->findOrFail($id);

            $notification->markAsRead();

            Log::info('Notification marked as read', [
                'user_id' => $request->user()->id,
                'notification_id' => $id,
            ]);

            return response()->json([
                'message' => 'Notification marked as read.',
                'notification' => $this->formatNotification($notification),
            ]);
        } catch (\Exception $exception) {
            Log::error('Mark as read error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to mark notification as read.',
            ], 500);
        }
    }

    /**
     * Mark a notification as unread.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function markAsUnread(Request $request, int $id): JsonResponse
    {
        try {
            $notification = Notification::where('user_id', $request->user()->id)
                ->findOrFail($id);

            $notification->markAsUnread();

            Log::info('Notification marked as unread', [
                'user_id' => $request->user()->id,
                'notification_id' => $id,
            ]);

            return response()->json([
                'message' => 'Notification marked as unread.',
                'notification' => $this->formatNotification($notification),
            ]);
        } catch (\Exception $exception) {
            Log::error('Mark as unread error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to mark notification as unread.',
            ], 500);
        }
    }

    /**
     * Delete a notification.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $notification = Notification::where('user_id', $request->user()->id)
                ->findOrFail($id);

            $notification->delete();

            Log::info('Notification deleted', [
                'user_id' => $request->user()->id,
                'notification_id' => $id,
            ]);

            return response()->json([
                'message' => 'Notification deleted.',
            ]);
        } catch (\Exception $exception) {
            Log::error('Delete notification error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to delete notification.',
            ], 500);
        }
    }

    /**
     * Mark all notifications as read.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        try {
            $count = Notification::where('user_id', $request->user()->id)
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]);

            Log::info('All notifications marked as read', [
                'user_id' => $request->user()->id,
                'count' => $count,
            ]);

            return response()->json([
                'message' => 'All notifications marked as read.',
                'count' => $count,
            ]);
        } catch (\Exception $exception) {
            Log::error('Mark all as read error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to mark all notifications as read.',
            ], 500);
        }
    }

    /**
     * Get unread notification count.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getUnreadCount(Request $request): JsonResponse
    {
        try {
            $count = Notification::where('user_id', $request->user()->id)
                ->where('is_read', false)
                ->count();

            return response()->json([
                'unread_count' => $count,
            ]);
        } catch (\Exception $exception) {
            Log::error('Get unread count error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to get unread count.',
            ], 500);
        }
    }
}