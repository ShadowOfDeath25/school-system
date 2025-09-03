import {useCurrentUser} from "@hooks/api/auth.js";

export const useCan = (permission) => {
    const {data: user} = useCurrentUser()
    return user.roles.includes("Super Admin") || user.permissions.includes(permission);
}
