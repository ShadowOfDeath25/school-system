<?php

namespace App\Enums;

enum Grade: int
{
    case FIRST = 1;
    case SECOND = 2;
    case THIRD = 3;
    case FOURTH = 4;
    case FIFTH = 5;
    case SIXTH = 6;
    case SEVENTH = 7;
    case EIGHTH = 8;
    case NINTH = 9;
    case TENTH = 10;
    case ELEVENTH = 11;


    public function label(): string
    {
        return match ($this) {
            self::FIRST => 'الاول رياض اطفال',
            self::SECOND => 'الثاني رياض اطفال',
            self::THIRD => 'الاول الابتدائي',
            self::FOURTH => 'الثاني الابدتائي',
            self::FIFTH => 'الثالث الابتدائي',
            self::SIXTH => 'الرابع الابتدائي',
            self::SEVENTH => 'الخامس الابتدائي',
            self::EIGHTH => 'السادس الابتدائي',
            self::NINTH => 'الاول الاعدادي',
            self::TENTH => 'الثاني الاعدادي',
            self::ELEVENTH => 'الثالث الاعدادي',
        };
    }
}
