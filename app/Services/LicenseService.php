<?php

declare(strict_types=1);

namespace App\Services;

final class LicenseService
{
    private string $storagePath;

    public function __construct()
    {
        $this->storagePath = storage_path('app/license.enc');
    }

    public function generate(): void
    {
        $this->writeState(['killed' => false]);
    }

    public function isKilled(): bool
    {
        return $this->readState()['killed'] ?? true;
    }

    public function toggle(): array
    {
        $state = $this->readState();
        $state['killed'] = !($state['killed'] ?? false);
        $this->writeState($state);

        return $state;
    }

    public function readState(): array
    {
        if (!file_exists($this->storagePath)) {
            return ['killed' => true];
        }

        $payload = file_get_contents($this->storagePath);
        $decoded = $this->decrypt($payload);

        if ($decoded === null) {
            return ['killed' => true];
        }

        return $decoded;
    }

    public function writeState(array $data): void
    {
        $payload = $this->encrypt($data);
        file_put_contents($this->storagePath, $payload);
    }

    private function getKey(): string
    {
        return hex2bin(config('license.password_hash'));
    }

    private function encrypt(array $data): string
    {
        $iv = random_bytes(openssl_cipher_iv_length('aes-256-cbc'));
        $ciphertext = openssl_encrypt(
            json_encode($data, JSON_THROW_ON_ERROR),
            'aes-256-cbc',
            $this->getKey(),
            OPENSSL_RAW_DATA,
            $iv,
        );

        return base64_encode($iv . $ciphertext);
    }

    private function decrypt(string $payload): ?array
    {
        $decoded = base64_decode($payload, true);

        if ($decoded === false) {
            return null;
        }

        $ivLength = openssl_cipher_iv_length('aes-256-cbc');
        $iv = substr($decoded, 0, $ivLength);
        $ciphertext = substr($decoded, $ivLength);

        $plaintext = openssl_decrypt(
            $ciphertext,
            'aes-256-cbc',
            $this->getKey(),
            OPENSSL_RAW_DATA,
            $iv,
        );

        if ($plaintext === false) {
            return null;
        }

        $data = json_decode((string) $plaintext, true);

        if (!is_array($data)) {
            return null;
        }

        return $data;
    }
}
