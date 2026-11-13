import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileByUserId, getProfilesPages } from "../api/getProfiles";
import type { UserProfile } from "../types/ProfileType";
import type { FeatureTablePagesProps } from "@/components/ui/feature-tables/types";
import { updateProfile, type updateProfileProps } from "../api/updateProfile";
import useAuthContext from "./useAuthContext";

export const useGetProfilesPages = ({ page, pageSize }: FeatureTablePagesProps<UserProfile>) => {
	const profilesQuery = useQuery({
		queryKey: ["profilesPage", page, pageSize],
		queryFn: () => getProfilesPages({ page, pageSize }),
		placeholderData: keepPreviousData,
	});

	return {
		profiles: profilesQuery.data?.data || [],
		...profilesQuery,
		totalPages: profilesQuery.data?.totalPages || 1,
		count: profilesQuery.data?.count,
	};
};

export const useGetProfileByUserId = ({ id }: { id: UserProfile["id"] }) => {
	const profileQuery = useQuery({
		queryKey: ["profile", id],
		queryFn: () => getProfileByUserId({ id }),
	});

	return {
		profile: profileQuery.data || null,
		...profileQuery,
	};
};

export const useUpdateProfile = ({ id, updates }: updateProfileProps) => {
	const queryClient = useQueryClient();
	const { user, setUserProfile } = useAuthContext();

	const profileMutation = useMutation({
		mutationFn: () => updateProfile({ id, updates }),
		onSuccess: async () => {
			// Updates the auth context to reflect changes if its the own user changing
			if (user?.id === id) {
				const updatedProfile = await getProfileByUserId({ id });
				setUserProfile(updatedProfile);
			}

			await queryClient.invalidateQueries({ queryKey: ["profile", id] });
			await queryClient.invalidateQueries({ queryKey: ["profilesPage"] });
		},
	});

	return {updateProfile: profileMutation.mutate, ...profileMutation};
};
