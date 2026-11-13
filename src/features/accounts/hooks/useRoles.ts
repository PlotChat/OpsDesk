import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../api/getRoles";
import type { UserProfileRole } from "@/features/authentication/types/ProfileType";

export function useGetRoles(){
    const queryRoles = useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
    })

    return {
        roles: queryRoles.data?.data as UserProfileRole[],
        count: queryRoles.data?.count,
    }
}