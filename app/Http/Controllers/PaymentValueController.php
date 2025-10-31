<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentValue\StorePaymentValueRequest;
use App\Http\Requests\PaymentValue\UpdatePaymentValueRequest;
use App\Http\Resources\PaymentValueResource;
use App\Models\PaymentValue;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\Request;

class PaymentValueController extends Controller
{
    use HasCRUD, HasFilters;

    protected string $model = PaymentValue::class;
    protected string $storeRequest = StorePaymentValueRequest::class;
    protected string $updateRequest = UpdatePaymentValueRequest::class;
    protected string $resource = PaymentValueResource::class;
    protected array $searchable = [
        'academic_year', 'type', 'grade', 'language', 'level'
    ];
    protected array $filterable = [
        'academic_year', 'type', 'grade', 'language', 'level'
    ];


    public function createNewYearValues(Request $request)
    {
        $validated = $request->validate([
            'new_academic_year' => 'required|string|max:255',
            'source_academic_year' => 'required|string|max:255|exists:payment_values,academic_year',
        ]);

        $newAcademicYear = $validated['new_academic_year'];
        $sourceAcademicYear = $validated['source_academic_year'];

        $exists = $this->model::where('academic_year', $newAcademicYear)->exists();

        if ($exists) {
            return response()->json(['message' => 'اخر سنة دراسية موجودة بالفعل' . $newAcademicYear . ' already exist.'], 409); // 409 Conflict
        }


        $sourceValues = $this->model::where('academic_year', $sourceAcademicYear)->get();


        $newValues = $sourceValues->map(function ($item) use ($newAcademicYear) {
            $newItem = $item->replicate(['id']);
            $newItem->academic_year = $newAcademicYear;
            return $newItem->getAttributes();
        });

        $this->model::insert($newValues->toArray());

        return response()->json(['message' => 'تم اضافة السنة الدراسية الجديدة.'], 201);
    }

}
