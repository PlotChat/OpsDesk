import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useAuthContext from "@/features/authentication/hooks/useAuthContext";
import { useUpdateProfile } from "@/features/authentication/hooks/useProfiles";
import type { UserProfile } from "@/features/authentication/types/ProfileType";
import { cn } from "cn";
import { useState, type SubmitEvent } from "react";

const ProfileCard = () => {
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const { userProfile, isLoading } = useAuthContext();

	if (isLoading) {
		return <ProfileCardSkeleton />;
	}

	if (userProfile === null) {
		return <div className="text-red-500">Error loading your user profile</div>;
	}

	if (!isEdit) {
		return <ProfileCardDefault isEdit={isEdit} setIsEdit={setIsEdit} profile={userProfile} />;
	}

	if (isEdit) {
		return <ProfileCardForm setIsEdit={setIsEdit} profile={userProfile}></ProfileCardForm>;
	}
};

const getCardField = ({ value, label }: { value: string | null | undefined; label: string }) => {
	return (
		<Field key={value} className="rounded-2xl bg-muted p-3.5">
			<label>{label}</label>
			<h3 className={cn(!value && "text-muted-foreground/50")}>{value || "Not set"}</h3>
		</Field>
	);
};

const ProfileCardDefault = ({
	profile,
	isEdit,
	setIsEdit,
}: {
	profile: UserProfile | null;
	isEdit: boolean;
	setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const cardFields: { value: string | null | undefined; label: string }[] = [
		{ value: profile?.email, label: "Email" },
		{ value: profile?.full_name, label: "Full Name" },
		{
			value: profile?.created_at,
			label: "Creation Date",
		},
	];
	return (
		<Card>
			<CardHeader>
				<CardTitle>User Profile</CardTitle>
				<CardDescription>Feel free to edit anything editable.</CardDescription>
			</CardHeader>
			<CardContent>
				<FieldSet>
					<FieldGroup>
						{cardFields.map((f) => getCardField({ value: f.value, label: f.label }))}
					</FieldGroup>
				</FieldSet>

				{isEdit && profile && (
					<ProfileCardForm profile={profile} setIsEdit={setIsEdit}></ProfileCardForm>
				)}
			</CardContent>
			<CardFooter>
				<div className="w-full flex flex-row justify-end">
					<Button onClick={() => setIsEdit(true)}>Edit</Button>
				</div>
			</CardFooter>
		</Card>
	);
};

const ProfileCardForm = ({
	profile,
	setIsEdit,
}: {
	profile: UserProfile;
	setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [localError, setLocalError] = useState<string>("");

	const [email, setEmail] = useState<UserProfile["email"]>(profile.email);
	const [fullName, setFullName] = useState<UserProfile["full_name"]>(profile.full_name);

	const { updateProfile, isPending } = useUpdateProfile({
		id: profile.id,
		updates: { email, full_name: fullName },
	});

	const handleCancelEdit = () => {
		setEmail(profile.email);
		setFullName(profile.full_name);
		setLocalError("");
		setIsEdit(false);
	};

	const handleSaveChanges = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLocalError("");

		if (!fullName.trim() || !email?.trim()) {
			setLocalError("Name and email are required.");
			return;
		}

		updateProfile(undefined, {
			onSuccess: () => {
				setIsEdit(false);
				setLocalError("");
			},
			onError: (error) => {
				setLocalError(error instanceof Error ? error.message : "Error when saving changes.");
			},
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>User Profile</CardTitle>
				<CardDescription>Feel free to edit anything editable.</CardDescription>
			</CardHeader>

			<div className="text-red-500">{localError}</div>

			<form onSubmit={handleSaveChanges}>
				<CardContent>
					<FieldSet>
						<FieldGroup className="space-y-1">
							<Field>
								<label>Email</label>
								<Input
									type="email"
									value={email}
									disabled={isPending}
									onChange={(e) => setEmail(e.currentTarget.value)}
								/>
							</Field>
							<Field>
								<label>Full Name</label>
								<Input
									value={fullName}
									disabled={isPending}
									onChange={(e) => setFullName(e.currentTarget.value)}
								/>
							</Field>
							<Field>
								<label>Creation Date</label>
								<Input value={profile.created_at} disabled />
							</Field>
						</FieldGroup>
					</FieldSet>
				</CardContent>
				<CardFooter className="mt-5">
					<div className="w-full flex flex-row-reverse gap-1">
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : "Save Changes"}
						</Button>
						<Button type="button" variant={"secondary"} disabled={isPending} onClick={handleCancelEdit}>
							Cancel
						</Button>
					</div>
				</CardFooter>
			</form>
		</Card>
	);
};

const ProfileCardSkeleton = () => {
	return <div>Loading...</div>;
};
export default ProfileCard;
