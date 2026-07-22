<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\LicenseService;
use Illuminate\Console\Command;

final class KillswitchStatus extends Command
{
    protected $signature = 'license:status';
    protected $description = 'Check the current killswitch status';

    public function handle(LicenseService $licenseService): int
    {
        $state = $licenseService->readState();
        $killed = $state['killed'] ?? true;

        $this->info($killed ? 'killed' : 'active');

        return self::SUCCESS;
    }
}
