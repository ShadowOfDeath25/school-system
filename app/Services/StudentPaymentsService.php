<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class StudentPaymentsService
{
    const PAYMENT_TYPES = [
        'ADMINISTRATIVE' => 'مصروفات ادارية',
        'TUITION' => 'مصروفات دراسية',
        'BOOKS' => 'مصروفات الكتب',
        'UNIFORM' => 'مصروفات الزي',
        'WITHDRAWAL' => 'مصروفات سحب الملف',
        "EXTRA-DUES" => 'مستحقات اضافية'
    ];

    public function getStudentPayments(Student $student, $academicYear): Collection
    {

        $result = DB::query()->fromSub(function (Builder $q) use ($student, $academicYear) {


            $q->select(
                'value',
                'type',
                DB::raw('"required" as source')
            )
                ->from('payment_values')
                ->where('language', $student->language)
                ->where('level', $student->level)
                ->where('academic_year', $academicYear);
            if (!$student->withdrawn) {
                $q->whereNot('type', '=', self::PAYMENT_TYPES['WITHDRAWAL']);
            }

            $q->unionAll(
                DB::table('extra_dues')
                    ->where('student_id', $student->id)
                    ->where('academic_year',$academicYear)
                    ->select([
                        DB::raw('SUM(value) as value'),
                        DB::raw('"'.self::PAYMENT_TYPES['EXTRA-DUES'].'" as type'),
                        DB::raw('"required" as source')
                    ])
            );
            $q->unionAll(
                DB::table('book_purchases')
                    ->join('books', 'books.id', '=', 'book_purchases.book_id')
                    ->where('book_purchases.student_id', $student->id)
                    ->select([
                        DB::raw('SUM(books.price * book_purchases.quantity) as value'),
                        DB::raw('"' . self::PAYMENT_TYPES['BOOKS'] . '"' . ' as type'),
                        DB::raw('"required" as source')
                    ])
            );


            $q->unionAll(
                DB::table('uniform_purchases')
                    ->join('uniforms', 'uniforms.id', '=', 'uniform_purchases.uniform_id')
                    ->where('uniform_purchases.student_id', $student->id)
                    ->select([
                        DB::raw('SUM(uniforms.sell_price * uniform_purchases.quantity) as value'),
                        DB::raw('"' . self::PAYMENT_TYPES['UNIFORM'] . '"' . ' as type'),
                        DB::raw('"required" as source')
                    ])
            );


            $q->unionAll(
                DB::table('exemptions')
                    ->where('type', $student->type)
                    ->orWhere('student_id',$student->id)
                    ->select([
                        DB::raw('SUM(value) as value'),
                        DB::raw('"exemptions" as type'),
                        DB::raw('"exemptions" as source')
                    ])
            );


            $q->unionAll(
                DB::table("payments")
                    ->where('student_id', $student->id)
                    ->where('academic_year', $academicYear)
                    ->select([
                        DB::raw('SUM(value) as value'),
                        'type',
                        DB::raw('"paid" as source')
                    ])
                    ->groupBy('type')
            );

        }, 'payments')
            ->get()
            ->groupBy('source')
            ->map(function ($items) {
                return $items->groupBy('type')->map(function ($typeItems) {
                    return $typeItems->sum('value');
                });
            });


        $result['paid'] = [
            self::PAYMENT_TYPES['ADMINISTRATIVE'] => $result['paid'][self::PAYMENT_TYPES['ADMINISTRATIVE']] ?? 0,
            self::PAYMENT_TYPES['TUITION'] => $result['paid'][self::PAYMENT_TYPES['TUITION']] ?? 0,
            self::PAYMENT_TYPES['BOOKS'] => $result['paid'][self::PAYMENT_TYPES['BOOKS']] ?? 0,
            self::PAYMENT_TYPES['UNIFORM'] => $result['paid'][self::PAYMENT_TYPES['UNIFORM']] ?? 0,
            self::PAYMENT_TYPES['EXTRA-DUES'] => $result['paid'][self::PAYMENT_TYPES['EXTRA-DUES']] ?? 0,
        ];

        $result['remaining'] = [
            self::PAYMENT_TYPES['ADMINISTRATIVE'] => ($result['required'][self::PAYMENT_TYPES['ADMINISTRATIVE']] ?? 0) - ($result['paid'][self::PAYMENT_TYPES['ADMINISTRATIVE']] ?? 0),
            self::PAYMENT_TYPES['TUITION'] => $result['required'][self::PAYMENT_TYPES['TUITION']] - ($result['exemptions']['exemptions'] ?? 0) - ($result['paid'][self::PAYMENT_TYPES['TUITION']] ?? 0),
            self::PAYMENT_TYPES['BOOKS'] => ($result['required'][self::PAYMENT_TYPES["BOOKS"]] ?? 0) - ($result['paid'][self::PAYMENT_TYPES['BOOKS']] ?? 0),
            self::PAYMENT_TYPES['UNIFORM'] => ($result['required'][self::PAYMENT_TYPES['UNIFORM']] ?? 0) - ($result['paid'][self::PAYMENT_TYPES['UNIFORM']] ?? 0),
            self::PAYMENT_TYPES['EXTRA-DUES'] => ($result['required'][self::PAYMENT_TYPES['EXTRA-DUES']] ?? 0) - ($result['paid'][self::PAYMENT_TYPES['EXTRA-DUES']] ?? 0),
        ];
        $result['total'] = [
            'required' => collect($result['required'] ?? [0])->sum(),
            'paid' => collect($result['paid'] ?? [0])->sum(),
            'exemption' => collect($result['exemptions'] ?? [0])->sum(),
            'remaining' => collect($result['remaining'] ?? [0])->sum()
        ];
        return $result;

    }
}
