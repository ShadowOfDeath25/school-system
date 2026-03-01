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
