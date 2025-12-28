<?php

namespace App\Enums;


enum PaymentType: string
{
    case ADMINISTRATIVE = 'مصروفات ادراية';
    case TUITION = 'مصروفات دراسية';
    case UNIFORM = 'مصروفات الزي';
    case BOOK = 'مصروفات الكتب';
    case ADDITIONAL = 'مستحقات اضافية';
    case WITHDRAWAL = 'مصروفات سحب الملف';
}
