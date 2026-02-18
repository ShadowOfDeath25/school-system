<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function preview(string $uuid)
    {
        $file_path = storage_path("app/reports/$uuid.pdf");

        if (!file_exists($file_path)) {
            abort(404, "هذا التقرير غير موجود");
        }

        return response()
            ->file($file_path, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline',
            ])
            ->deleteFileAfterSend(true);


    }
}
