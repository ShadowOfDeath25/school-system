<?php

namespace App\Enums;


enum PaymentType: string
{
    case ADMINISTRATIVE = 'مصروفات ادارية';
    case TUITION = 'مصروفات دراسية';
    case UNIFORM = 'مصروفات الزي';
    case BOOK = 'مصروفات الكتب';
    case ADDITIONAL = 'مستحقات اضافية';
    case WITHDRAWAL = 'مصروفات سحب الملف';
}
