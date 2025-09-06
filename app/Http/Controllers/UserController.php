<?php

namespace App\Http\Controllers;

use App\Exceptions\AuthorizationException;
use App\Http\Requests\User\RoleRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use HasCRUD,HasFilters;

    protected string $model = User::class;
    protected string $storeRequest = StoreUserRequest::class;
    protected string $updateRequest = UpdateUserRequest::class;
    protected string $resource = UserResource::class;

    protected array $filterable = ['roles'];

    protected array $searchable = [
        'name', 'email'
    ];

    /**
     * @throws AuthorizationException
     */
    public function assignRole(RoleRequest $request, User $user)
    {
        $this->authorizeAction("assign");
        $roles = $request->validated();
        $user->assignRole($roles);
        $user->save();
        return response()->json(["message" => "Role was assigned successfully", "user" => UserResource::make($user)]);
    }

    /**
     * @throws AuthorizationException
     */
    public function syncRole(RoleRequest $request, User $user)
    {
        $this->authorizeAction("sync");
        $roles = $request->validated();
        $user->syncRoles($roles);
        return response()->json(["message" => "Role was synced successfully", "user" => UserResource::make($user)]);
    }

    /**
     * @throws AuthorizationException
     */
    public function removeRole(RoleRequest $request, User $user)
    {
        $this->authorizeAction("remove");
        $roles= $request->validated();
        foreach($roles as $role){
            $user->removeRole($role);
        }
        return response()->json(["message" => "Role was removed successfully", "user" => UserResource::make($user)]);
    }


}
