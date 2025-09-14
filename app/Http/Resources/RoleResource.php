<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;

class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=>$this->id,
            "name"=>$this->name,
            "permissions" => $this->permissions->groupBy(function($item){
                return Str::afterLast($item->name,' ');
            })->map(function($item){
                return $item->pluck(function($item){
                    return Str::beforeLast($item->name," ");
                });
            })
        ];
    }
}
