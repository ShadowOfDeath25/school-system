<?php


if (!function_exists("getGradeNumber")) {
    function getGradeNumber(int $grade): int
    {
        return match (true) {
            $grade < 1, $grade > 11 => throw new Error("Invalid Grade Number"),
            $grade <= 2 => $grade,
            $grade <= 8 => $grade - 2,
            $grade <= 11 => $grade - 8,
        };
    }

}
if (!function_exists("getLevel")) {
    function getLevel(int $grade): string
    {
        return match ($grade) {
            1, 2 => "رياض اطفال",
            3, 4, 5, 6 => "ابتدائي",
            7, 8, 9, 10, 11 => "اعدادي",
            default => throw new Error("Invalid Grade Number")
        };
    }
}
if (!function_exists("generateReportUUID")) {
    function generateReportUUID(): array
    {
        $uuid = Str::uuid()->toString();
        $filePath = "reports/$uuid.pdf";
        $dir = storage_path('app/reports');
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return ["uuid" => $uuid, "filePath" => $filePath];
    }
}
