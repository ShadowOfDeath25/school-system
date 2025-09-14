<?php

namespace App\Http\Controllers;

use App\Exceptions\AuthorizationException;
use App\Http\Requests\Roles\StoreRoleRequest;
use App\Http\Requests\Roles\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Traits\HasCRUD;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    use HasCRUD;

    protected string $model = Role::class;
    protected string $storeRequest = StoreRoleRequest::class;
    protected string $updateRequest = UpdateRoleRequest::class;
    protected string $resource = RoleResource::class;

    public function store(StoreRoleRequest $request)
    {
        $this->authorizeAction("create");
        $data = $request->validated();
        $role = new Role([
            'name' => $data["name"]
        ]);
        if ($request->has('permissions')) {
            foreach ($data["permissions"] as $permission) {
                $role->givePermissionTo(Permission::findOrCreate($permission));
            }
        }
        $role->save();
        return response()->json($role, 201);
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->authorizeAction("update");
        $data = $request->validated();
        $role->update($data);
        if ($request->has("permissions")) {
            $role->syncPermissions($data["permissions"]);
        }
        $role->save();

        return response()->json(["role"=>$role]);
    }


}
