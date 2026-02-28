<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcademicYear\StoreAcademicYearRequest;
use App\Http\Resources\AcademicYearResource;
use http\Env\Response;
use Illuminate\Http\Request;

use App\Models\AcademicYear;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Laminas\Diactoros\Response\JsonResponse;
use Throwable;

class AcademicYearController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('nameOnly')) {

            return AcademicYearResource::collection(AcademicYear::select('name')->orderBy('name', 'desc')->paginate($request->per_page, 30));

        }

        return AcademicYearResource::collection(AcademicYear::select(['id', 'name', 'active'])->orderBy('name', 'desc')->paginate($request->per_page, 30));

    }

    public function store(StoreAcademicYearRequest $request)
    {
        $academicYear = new AcademicYear($request->validated());
        $academicYear->save();
        return response()->json(['academicYear' => $academicYear], 201);
    }

    /**
     * @throws Throwable
     */
    public function activate(AcademicYear $academicYear)
    {
        DB::transaction(function () use ($academicYear) {
            AcademicYear::whereKeyNot($academicYear->id)
                ->update(['active' => false]);
            $academicYear->update(['active' => true]);
        });
        return response('', 204);
    }

}
