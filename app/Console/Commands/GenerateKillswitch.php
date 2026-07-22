<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\LicenseService;
use Illuminate\Console\Command;

final class GenerateKillswitch extends Command
{
    protected $signature = 'license:generate';
    protected $description = 'Generate the initial killswitch license file';

    public function handle(LicenseService $licenseService): int
    {
        $licenseService->generate();

        $this->info('License file generated successfully.');

        return self::SUCCESS;
    }
}
