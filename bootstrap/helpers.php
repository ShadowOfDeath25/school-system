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
