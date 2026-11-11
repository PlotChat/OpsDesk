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
		<Field className="rounded-2xl bg-muted p-3.5">
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
	const cardFields = [
		{ value: profile?.email, label: "Email" },
		{ value: profile?.full_name, label: "Full Name" },
	] satisfies { value: string | null | undefined; label: string }[];
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
				<Button onClick={() => setIsEdit(true)}>Edit</Button>
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
	const [email, setEmail] = useState<UserProfile["email"]>(profile.email);
	const [fullName, setFullName] = useState<UserProfile["full_name"]>(profile.full_name);

	const resetAllInputs = () => {
		setEmail("");
		setFullName("");
	};

	const handleCancelEdit = () => {
		resetAllInputs();
		setIsEdit(false);
	};

	const handleSaveChanges = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		console.log("ProfileCard.tsx > ProfileCardForm");
		setIsEdit(false);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>User Profile</CardTitle>
				<CardDescription>Feel free to edit anything editable.</CardDescription>
			</CardHeader>

			<form onSubmit={handleSaveChanges}>
				<CardContent>
					<FieldSet>
						<FieldGroup>
							<Field>
								<label>Email</label>
								<Input
									value={email}
									onChange={(e) => setEmail(e.currentTarget.value)}
									placeholder="johnny@johnny.com..."
								/>
							</Field>
							<Field>
								<label>Full Name</label>
								<Input
									value={fullName}
									onChange={(e) => setFullName(e.currentTarget.value)}
									placeholder="Johnny..."
								/>
							</Field>
						</FieldGroup>
					</FieldSet>
				</CardContent>
				<CardFooter className="mt-5">
					<div className="space-y-1">
						<Button type="submit">Save Changes</Button>
						<Button variant={"secondary"} onClick={() => handleCancelEdit()}>
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
