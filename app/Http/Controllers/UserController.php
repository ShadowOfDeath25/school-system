<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\HasCRUD;

class UserController extends Controller
{
    use HasCRUD;

    protected string $model = User::class;
    protected string $storeRequest = StoreUserRequest::class;
    protected string $updateRequest = UpdateUserRequest::class;
    protected string $resource = UserResource::class;

    public function assignRole(User $user, array $roles)
    {
        $user->assignRole($roles);
        return response()->json(["message" => "Role was assigned successfully", "user" => UserResource::make($user)]);
    }

    public function syncRole(User $user, string|array $roles)
    {
        $user->syncRoles($roles);
        return response()->json(["message" => "Role was synced successfully", "user" => UserResource::make($user)]);
    }

    public function removeRole(User $user, string|array $role)
    {
        $user->removeRole($role);
        return response()->json(["message" => "Role was removed successfully", "user" => UserResource::make($user)]);
    }
}
