import { supabase } from "@/lib/supabase";
import type { RawUserProfile, UserProfile, UserProfileRole } from "../types/ProfileType";
import { calcTotalPages, formatTimeToDMY, getPageRange } from "@/lib/utils";
import type {
	FeatureTablePagesProps,
	FeatureTablePagesResponse,
} from "@/components/ui/feature-tables/types";
import type { UserProfileFilterType } from "../types/ProfileType";

export async function getProfileByUserId({ id }: { id: UserProfile["id"] }) {
	const { data, error } = await supabase
		.from("profiles")
		.select("*, roles(id, name)")
		.eq("id", id)
		.maybeSingle();

	if (error) {
		throw new Error("Error getting profile by user id");
	}

	if (!data) return null;

	return {
		...data,
		role_id: data.roles?.id ?? data.role_id,
		role_name: data.roles?.name ?? "customer",
		created_at: formatTimeToDMY(data.created_at.toString()),
	} as UserProfile;
}

// export interface GetProfilesPagesProps extends FeatureTablePagesProps {
// }

export async function getProfilesPages({
	page,
	pageSize = 10,
	sortBy = { column: "created_at", isAscending: false },
	filterBy = { roles: [], search: "" },
}: FeatureTablePagesProps<UserProfile, UserProfileFilterType>): Promise<
	FeatureTablePagesResponse<UserProfile>
> {
	const { from, to } = getPageRange(page, pageSize);

	let query = supabase.from("profiles").select("*, roles(id, name)", { count: "exact" });

	const searchTerm = filterBy.search.trim();
	if (searchTerm) {
		query = query.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
	}

	if (filterBy.roles.length > 0) {
		query = query.in("role_id", filterBy.roles);
	}

	if (sortBy.column === "role_name") {
		query = query.order("name", {
			ascending: sortBy.isAscending,
			referencedTable: "roles",
		});
	} else {
		query = query.order(sortBy.column, { ascending: sortBy.isAscending });
	}

	const { data, error, count } = await query.order("id", { ascending: true }).range(from, to);

	if (error) {
		throw new Error("Error fetching accounts pages");
	}

	const formattedData: UserProfile[] = data.map((d: RawUserProfile) => {
		const unwrappedRole = {
			role_name: (d.roles?.name as UserProfileRole["name"]) ?? "customer",
			role_id: d.roles?.id ?? d.role_id,
		};

		return {
			...d,
			...unwrappedRole,
			created_at: formatTimeToDMY(d.created_at.toString()),
		};
	});

	const totalPages = calcTotalPages(count, pageSize);

	return { data: formattedData, count, totalPages, error };
}

export async function getProfileByEmail({ email }: { email: string }) {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("email", email)
		.limit(1)
		.maybeSingle();

	if (error) throw new Error("Error getting profile by email");

	if (!data) throw new Error("User not found by provided email");

	return data as UserProfile;
}
