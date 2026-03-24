<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActivityLog\ActivityLogIndexRequest;
use App\Models\User;
use App\Traits\HasFilters;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{


    /**
     * Display a listing of the activity logs.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(ActivityLogIndexRequest $request)
    {
        $activities = Activity::with(['causer', 'subject'])
            ->when($request->has('start_date'), function (Builder $query) use ($request) {
                $query->whereDate('created_at', '>=', $request->start_date);
            })
            ->when($request->has('end_date'), function (Builder $query) use ($request) {
                $query->whereDate('created_at', '<=', $request->end_date);
            })
            ->when($request->has('users'), function (Builder $query) use ($request) {
                $query->whereIn('causer_id',$request->users);
            })
            ->latest()
            ->paginate(request()->input("perPage") ?? 30);

        $formattedLogs = $activities->map(function ($activity) {
            $userName = $activity->causer ? $activity->causer->name : 'نظام';


            $action = trans("activitylog.actions.{$activity->event}") ?? $activity->event;


            $modelClass = $activity->subject_type;
            $modelBaseName = class_basename($modelClass);
            $modelTranslation = trans("activitylog.models.{$modelBaseName}") ?? $modelBaseName;

            $sentenceParams = [
                'user' => $userName,
                'action' => $action,
                'model' => $modelTranslation,
                'id' => in_array($activity->event, ['created', 'updated', 'deleted']) ? "رقم: {$activity->subject_id}" : '',
            ];

            $logMessage = trans('activitylog.sentence', $sentenceParams);

            return [
                'log' => $logMessage,
                'date' => $activity->created_at->locale('ar_EG')->translatedFormat('j F Y - h:i A'),
            ];
        });

        return response()->json([
            'data' => $formattedLogs,
            'meta' => [
                'current_page' => $activities->currentPage(),
                'last_page' => $activities->lastPage(),
                'total' => $activities->total(),
            ]
        ]);
    }

    public function delete(Activity $activity)
    {
        $activity->delete();
        return response()->noContent();
    }

    public function filters()
    {
        $users = User::whereHas('activities')->distinct()->select(["id","name"])->get();
        return response()->json(["users" => $users]);
    }
}
