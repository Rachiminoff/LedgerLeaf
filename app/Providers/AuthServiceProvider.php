<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Customize the email verification notification
        VerifyEmail::toMailUsing(function ($notifiable, $url) {
            return (new MailMessage)
                ->subject('Verify Your LedgerLeaf Account')
                ->greeting('Hello ' . $notifiable->name . '!')
                ->line('Welcome to LedgerLeaf! Please verify your email address to start managing your finances with confidence.')
                ->line('Click the button below to verify your email and access your financial dashboard.')
                ->action('Verify Email Address', $url)
                ->line('This verification link will expire in 60 minutes.')
                ->line('If you did not create an account, no further action is required.')
                ->line('---')
                ->salutation('Best regards, The LedgerLeaf Team');
        });
    }
}