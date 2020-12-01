<?php

namespace Concrete\Core\Notification;

use Concrete\Core\Application\Application;
use Concrete\Core\Foundation\Service\Provider as ServiceProvider;
use Concrete\Core\Notification\Type\UserDeactivatedType;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key;
use Symfony\Component\Mercure\Publisher;
use Symfony\Component\Mercure\PublisherInterface;

class NotificationServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(
            'Concrete\Core\Notification\Type\Manager',
            function ($app) {
                $manager = new Type\Manager($app);
                $manager->driver('core_update');
                $manager->driver('new_conversation_message');
                $manager->driver('new_form_submission');
                $manager->driver('new_private_message');
                $manager->driver('user_signup');
                $manager->driver('workflow_progress');
                $manager->driver(UserDeactivatedType::IDENTIFIER);
                return $manager;
            }
        );

        $this->app->singleton(
            'manager/notification/types',
            function ($app) {
                return $app->make('Concrete\Core\Notification\Type\Manager');
            }
        );

        $this->app->singleton(
            'manager/notification/subscriptions',
            function ($app) {
                return $app->make('Concrete\Core\Notification\Subscription\Manager');
            }
        );

        $this->app->singleton(
            PublisherInterface::class,
            function (Application $app) {
                $config = $app->make('config');
                $dbConfig = $app->make('config/database');
                $tokenFunction = function () use ($config, $dbConfig) {
                    $token = (new Builder())
                        ->withClaim('mercure', ['publish' => ['*']])
                        ->getToken(
                            new Sha256(),
                            new Key(
                                $dbConfig->get('concrete.notification.mercure.default.jwt_key')
                            )
                        );

                    return (string) $token;
                };

                return new Publisher(
                    $config->get('concrete.notification.mercure.default.publish_url'),
                    $tokenFunction
                );
            }
        );
    }
}
