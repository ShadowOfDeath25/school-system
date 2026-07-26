<?php

namespace App\Http\Controllers;

use App\Http\Requests\Transfer\StoreIncomingRequest;
use App\Http\Requests\Transfer\StoreOutgoingRequest;
use App\Http\Resources\TransferResource;
use App\Models\AcademicYear;
use App\Models\Student;
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
            'transfer' => new TransferResource($transfer->load(['student', 'creator'])),
        ], 201);
    }

    public function history(Request $request): JsonResponse
    {
        $query = StudentTransfer::with(['student', 'creator']);

        if ($request->filled('direction')) {
            $query->where('direction', $request->input('direction'));
        }

        if ($request->filled('academic_year')) {
            $query->where('academic_year', $request->input('academic_year'));
        }

        if ($request->filled('other_school_name')) {
            $query->where('other_school_name', 'like', '%'.$request->input('other_school_name').'%');
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('name_in_arabic', 'like', "%{$search}%")
                    ->orWhere('name_in_english', 'like', "%{$search}%")
                    ->orWhere('reg_number', 'like', "%{$search}%");
            });
        }

        $transfers = $query->orderBy('transfer_date', 'desc')
            ->paginate($request->input('per_page', 30));

        return TransferResource::collection($transfers)->response();
    }

    public function filters(): JsonResponse
    {
        $academicYears = AcademicYear::pluck('name');

        return response()->json([
            'academic_years' => $academicYears,
            'directions' => [
                ['value' => 'incoming', 'label' => 'تحويل الي المدرسة'],
                ['value' => 'outgoing', 'label' => 'تحويل من المدرسة'],
            ],
        ]);
    }
}
