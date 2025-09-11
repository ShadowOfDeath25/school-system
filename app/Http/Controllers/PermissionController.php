<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index()
    {
        return Permission::all()->groupBy(function($item){
            return Str::afterLast($item->name,' ');
        })->map(function($item){
           return $item->pluck(function($item){
               return Str::beforeLast($item->name," ");
           });
        });
    }
}
