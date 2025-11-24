<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class StudentPaymentsService
{
    const PAYMENT_TYPES = [
        'ADMINISTRATIVE' => 'مصروفات ادارية',
        'TUITION' => 'مصروفات دراسية',
        'BOOKS' => 'مصروفات الكتب',
        'UNIFORM' => 'مصروفات الزي'
    ];

    public function getStudentPayments(Student $student, $academicYear)
    {
        $result = DB::query()->fromSub(function (Builder $q) use ($student, $academicYear) {


            $q->select(
                'value',
                'type',
                DB::raw('"required" as source')
            )
                ->from('payment_values')
                ->where('academic_year', $academicYear)
                ->where('language', $student->language)
                ->where('level', $student->level);


            $q->unionAll(
                DB::table('book_purchases')
                    ->join('books', 'books.id', '=', 'book_purchases.book_id')
                    ->where('book_purchases.student_id', $student->id)
                    ->select([
                        DB::raw('SUM(books.price * book_purchases.quantity) as value'),
                        DB::raw('"' . self::PAYMENT_TYPES['BOOKS'].'"'.' as type' ),
                        DB::raw('"required" as source')
                    ])
            );


            $q->unionAll(
                DB::table('uniform_purchases')
                    ->join('uniforms', 'uniforms.id', '=', 'uniform_purchases.uniform_id')
                    ->where('uniform_purchases.student_id', $student->id)
                    ->select([
                        DB::raw('SUM(sell_price) as value'),
                        DB::raw('"' . self::PAYMENT_TYPES['UNIFORM'].'"'. ' as type'),
                        DB::raw('"required" as source')
                    ])
            );


            $q->unionAll(
                DB::table('exemptions')
                    ->where('type', $student->type)
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




        return $result;
    }
}
