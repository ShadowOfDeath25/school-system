<?php

namespace App\Http\Controllers;

use App\Exceptions\AuthorizationException;
use App\Http\Requests\User\RoleRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\HasCRUD;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use HasCRUD;

    protected string $model = User::class;
    protected string $storeRequest = StoreUserRequest::class;
    protected string $updateRequest = UpdateUserRequest::class;
    protected string $resource = UserResource::class;

    // The generic filterable property. 'roles' is now handled by the trait.
    protected array $filterable = ['roles'];

    /**
     * Columns that will be searched using a LIKE query.
     */
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

    /**
     * Provides the list of roles to the frontend for the filter dropdown.
     * This method is called by the HasCRUD trait's index() method.
     *
     * @return array
     */
    protected function getFilterOptions(): array
    {
        return [
            'roles' => Role::all()->pluck('name')
        ];
    }
}
