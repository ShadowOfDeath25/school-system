<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcademicYear\StoreAcademicYearRequest;
use Illuminate\Http\Request;

use App\Models\AcademicYear;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;

class AcademicYearController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('withName')) {

            return JsonResource::collection(AcademicYear::select('name')->orderBy('name', 'desc')->paginate($request->per_page, 30));

        }

        return AcademicYear::select('name')->pluck('name');

    }

    public function store(StoreAcademicYearRequest $request)
    {
        $academicYear = new AcademicYear($request->validated());
        $academicYear->save();
        return response()->json(['academicYear' => $academicYear], 201);
    }
}
