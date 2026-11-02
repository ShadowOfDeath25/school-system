<?php

namespace App\Http\Controllers;

use App\Http\Requests\Transfer\StoreIncomingRequest;
use App\Http\Requests\Transfer\StoreOutgoingRequest;
use App\Http\Resources\TransferResource;
use App\Models\AcademicYear;
use App\Models\Student;
use App\Models\StudentEnrollment;
use App\Models\StudentTransfer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransferController extends Controller
{
    public function storeIncoming(StoreIncomingRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $student = Student::findOrFail($validated['student_id']);

        if ($student->transferred_out) {
            throw ValidationException::withMessages([
                'student_id' => ['لا يمكن تسجيل تحويل الي المدرسة لطالب تم تحويله خارج المدرسة'],
            ]);
        }

        $activeYear = AcademicYear::activeCached();
        if (! $activeYear) {
            throw ValidationException::withMessages([
                'academic_year' => ['لا يوجد عام دراسي نشط'],
            ]);
        }

        $transfer = DB::transaction(function () use ($student, $validated, $activeYear, $request) {
            $student->update(['status' => 'مقيد']);

            return StudentTransfer::create([
                'student_id' => $student->id,
                'direction' => 'incoming',
                'other_school_name' => $validated['other_school_name'],
                'notes' => $validated['notes'] ?? null,
                'transfer_date' => now(),
                'academic_year' => $activeYear->name,
                'created_by' => $request->user()?->id,
            ]);
        });

        return response()->json([
            'message' => 'تم تسجيل التحويل الوارد بنجاح',
            'transfer' => new TransferResource($transfer->load(['student', 'creator'])),
        ], 201);
    }

    public function storeOutgoing(StoreOutgoingRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $student = Student::findOrFail($validated['student_id']);

        if ($student->withdrawn) {
            throw ValidationException::withMessages([
                'student_id' => ['الطالب تم سحب ملفه بالفعل'],
            ]);
        }

        if ($student->transferred_out) {
            throw ValidationException::withMessages([
                'student_id' => ['الطالب تم تحويله خارج المدرسة بالفعل'],
            ]);
        }

        $activeYear = AcademicYear::activeCached();
        if (! $activeYear) {
            throw ValidationException::withMessages([
                'academic_year' => ['لا يوجد عام دراسي نشط'],
            ]);
        }

        $transfer = DB::transaction(function () use ($student, $validated, $activeYear, $request) {
            $student->update([
                'status' => 'محول',
                'transferred_out' => true,
                'classroom_id' => null,
            ]);

            return StudentTransfer::create([
                'student_id' => $student->id,
                'direction' => 'outgoing',
                'other_school_name' => $validated['other_school_name'],
                'notes' => $validated['notes'] ?? null,
                'transfer_date' => now(),
                'academic_year' => $activeYear->name,
                'created_by' => $request->user()?->id,
            ]);
        });

        return response()->json([
            'message' => 'تم تسجيل التحويل الصادر بنجاح',
            'transfer' => new TransferResource($transfer->load(['student.parents', 'creator'])),
        ], 201);
    }

    public function history(Request $request): JsonResponse
    {
        $direction = $request->input('direction');
        $academicYear = $request->input('academic_year');
        $search = $request->input('search');
        $otherSchool = $request->input('other_school_name');
        $perPage = (int) $request->input('per_page', 30);

        if ($direction === 'internal') {
            $query = StudentEnrollment::where('status', 'نقل داخلي')
                ->with(['student.parents', 'fromClassroom', 'toClassroom']);

            if ($request->filled('academic_year')) {
                $query->where('to_academic_year', $academicYear);
            }

            if ($request->filled('other_school_name')) {
                $query->where(function ($q) use ($otherSchool) {
                    $q->whereHas('fromClassroom', fn ($cq) => $cq->where('name', 'like', "%{$otherSchool}%"))
                        ->orWhereHas('toClassroom', fn ($cq) => $cq->where('name', 'like', "%{$otherSchool}%"));
                });
            }

            if ($request->filled('search')) {
                $query->whereHas('student', fn ($q) => $q->searchByFullName($search));
            }

            $results = $query->orderBy('enrolled_at', 'desc')->paginate($perPage);

            $results->getCollection()->transform(function ($e) {
                $fromName = $e->fromClassroom?->name ?? 'غير مقيد';
                $toName = $e->toClassroom?->name ?? 'غير مقيد';

                return (object) [
                    'id' => 'enrollment_'.$e->id,
                    'student_id' => $e->student_id,
                    'student_name' => $e->student?->full_name ?? $e->student?->name_in_arabic,
                    'student_reg_number' => $e->student?->reg_number,
                    'direction' => 'internal',
                    'other_school_name' => "من: {$fromName} إلى: {$toName}",
                    'notes' => $e->reason,
                    'transfer_date' => $e->enrolled_at?->format('Y-m-d') ?? $e->created_at?->format('Y-m-d'),
                    'academic_year' => $e->to_academic_year,
                    'created_by' => null,
                    'created_at' => $e->created_at,
                ];
            });

            return TransferResource::collection($results)->response();
        }

        if ($direction === 'incoming' || $direction === 'outgoing') {
            $query = StudentTransfer::with(['student.parents', 'creator'])
                ->where('direction', $direction);

            if ($request->filled('academic_year')) {
                $query->where('academic_year', $academicYear);
            }

            if ($request->filled('other_school_name')) {
                $query->where('other_school_name', 'like', '%'.$otherSchool.'%');
            }

            if ($request->filled('search')) {
                $query->whereHas('student', fn ($q) => $q->searchByFullName($search));
            }

            $transfers = $query->orderBy('transfer_date', 'desc')->paginate($perPage);

            return TransferResource::collection($transfers)->response();
        }

        $transfersQuery = DB::table('student_transfers')
            ->join('students', 'student_transfers.student_id', '=', 'students.id')
            ->select([
                DB::raw("CONCAT('t_', student_transfers.id) as id"),
                'student_transfers.student_id',
                DB::raw("COALESCE(students.name_in_arabic, '') as student_name"),
                'students.reg_number as student_reg_number',
                'student_transfers.direction',
                'student_transfers.other_school_name',
                'student_transfers.notes',
                'student_transfers.transfer_date',
                'student_transfers.academic_year',
                DB::raw("NULL as created_by"),
                'student_transfers.created_at',
            ]);

        $enrollmentsQuery = DB::table('student_enrollments')
            ->join('students', 'student_enrollments.student_id', '=', 'students.id')
            ->leftJoin('classrooms as from_c', 'student_enrollments.from_classroom_id', '=', 'from_c.id')
            ->leftJoin('classrooms as to_c', 'student_enrollments.to_classroom_id', '=', 'to_c.id')
            ->where('student_enrollments.status', 'نقل داخلي')
            ->select([
                DB::raw("CONCAT('e_', student_enrollments.id) as id"),
                'student_enrollments.student_id',
                DB::raw("COALESCE(students.name_in_arabic, '') as student_name"),
                'students.reg_number as student_reg_number',
                DB::raw("'internal' as direction"),
                DB::raw("CONCAT('من: ', COALESCE(from_c.name, 'غير مقيد'), ' إلى: ', COALESCE(to_c.name, 'غير مقيد')) as other_school_name"),
                'student_enrollments.reason as notes',
                'student_enrollments.enrolled_at as transfer_date',
                'student_enrollments.to_academic_year as academic_year',
                DB::raw("NULL as created_by"),
                'student_enrollments.created_at',
            ]);

        if ($request->filled('academic_year')) {
            $transfersQuery->where('student_transfers.academic_year', $academicYear);
            $enrollmentsQuery->where('student_enrollments.to_academic_year', $academicYear);
        }

        if ($request->filled('search')) {
            $transfersQuery->where(function ($q) use ($search) {
                $q->where('students.name_in_arabic', 'like', "%{$search}%")
                    ->orWhere('students.name_in_english', 'like', "%{$search}%")
                    ->orWhere('students.nid', 'like', "%{$search}%")
                    ->orWhere('students.reg_number', 'like', "%{$search}%");
            });
            $enrollmentsQuery->where(function ($q) use ($search) {
                $q->where('students.name_in_arabic', 'like', "%{$search}%")
                    ->orWhere('students.name_in_english', 'like', "%{$search}%")
                    ->orWhere('students.nid', 'like', "%{$search}%")
                    ->orWhere('students.reg_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('other_school_name')) {
            $transfersQuery->where('student_transfers.other_school_name', 'like', "%{$otherSchool}%");
            $enrollmentsQuery->where(function ($q) use ($otherSchool) {
                $q->where('from_c.name', 'like', "%{$otherSchool}%")
                    ->orWhere('to_c.name', 'like', "%{$otherSchool}%");
            });
        }

        $union = $transfersQuery->unionAll($enrollmentsQuery);
        $results = DB::query()->fromSub($union, 'all_transfers')
            ->orderBy('transfer_date', 'desc')
            ->paginate($perPage);

        return TransferResource::collection($results)->response();
    }

    public function filters(): JsonResponse
    {
        $academicYears = AcademicYear::pluck('name');

        return response()->json([
            'academic_years' => $academicYears,
            'directions' => [
                ['value' => 'incoming', 'label' => 'تحويل الي المدرسة'],
                ['value' => 'outgoing', 'label' => 'تحويل من المدرسة'],
                ['value' => 'internal', 'label' => 'نقل داخلي'],
            ],
        ]);
    }
}
