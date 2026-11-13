import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useGetProfileByUserId,
	useUpdateProfile,
} from "@/features/authentication/hooks/useProfiles";
import type { UserProfile } from "@/features/authentication/types/ProfileType";
import { cn } from "cn";
import { useState, type SubmitEvent } from "react";
import { useGetRoles } from "../hooks/useRoles";

const inputTextStyles =
	"p-2 bg-secondary/30 border rounded-md text-sm min-h-[38px] flex items-center";
const getFieldStyles = (isEdit = false) => cn(!isEdit ? "p-3 bg-muted/70 rounded-lg" : "");

interface ViewEditAccountDialogProps {
	accountId: string;
	title: string;
	onOpenChange: () => void;
	open: boolean;
}

export default function ViewEditAccountDialog({
	accountId,
	title,
	onOpenChange,
	open,
}: ViewEditAccountDialogProps) {
	const { profile, isPending, isError, error } = useGetProfileByUserId({ id: accountId });

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				{isError && <div className="py-4 text-sm text-red-500">Error: {error.message}</div>}

				{isPending || !profile ? (
					<ViewEditAccountSkeleton />
				) : (
					<AccountEditForm profile={profile} onOpenChange={onOpenChange} />
				)}
			</DialogContent>
		</Dialog>
	);
}

function ViewEditAccountSkeleton() {
	return (
		<FieldSet>
			<FieldGroup className="mt-6 flex flex-col gap-4">
				{["id", "name", "email"].map((field) => (
					<Field key={field}>
						<div className={`${getFieldStyles()} h-19 animate-pulse`}></div>
					</Field>
				))}
				<div className="flex gap-4">
					<Field className="flex-1">
						<div className={`${getFieldStyles()} h-19 animate-pulse`}></div>
					</Field>
					<Field className="flex-1">
						<div className={`${getFieldStyles()} h-19 animate-pulse`}></div>
					</Field>
				</div>
			</FieldGroup>
			<div className="mt-2 flex justify-end gap-2">
				<Button type="button" disabled variant="secondary" className="w-15 animate-pulse"></Button>
				<Button type="button" disabled variant="default" className="w-15 animate-pulse"></Button>
			</div>
		</FieldSet>
	);
}

function AccountEditForm({
	profile,
	onOpenChange,
}: {
	profile: UserProfile;
	onOpenChange: () => void;
}) {
	const [isEdit, setIsEdit] = useState(false);
	const [localError, setLocalError] = useState("");

  // For inputs inside of the form
	const [fullName, setFullName] = useState(profile.full_name || "");
	const [email, setEmail] = useState(profile.email || "");
	const [roleId, setRoleId] = useState<UserProfile["role_id"]>(profile.role_id);

  // Update mutation
	const { updateProfile, isPending: isUpdating } = useUpdateProfile({
		id: profile.id,
		updates: { full_name: fullName, email, role_id: roleId },
	});

  // Role fetching and handling role name
	const { roles } = useGetRoles();
	const availableRoles = roles ?? [];
	const roleName =
		availableRoles.find((availableRole) => availableRole.id === roleId)?.name ??
		profile.role_name;

  // Check if any inputs has changed
	const hasChanged =
		fullName !== profile.full_name ||
		email !== (profile.email || "") ||
		roleId !== profile.role_id;

  // Handler functions for the form
	const resetInputs = () => {
		setFullName(profile.full_name || "");
		setEmail(profile.email || "");
		setRoleId(profile.role_id);
		setLocalError("");
	};

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();

		if (!fullName.trim() || !email.trim()) {
			setLocalError("Name and email are required.");
			return;
		}

		if (!hasChanged) {
			setIsEdit(false);
			setLocalError("");
			return;
		}

		updateProfile(undefined, {
			onSuccess: () => {
				setIsEdit(false);
				setLocalError("");
			},
			onError: () => {
				setLocalError("Error when saving changes.");
			},
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<FieldSet>
				<FieldGroup className="mt-2 flex flex-col gap-4">
					<div className="-mb-2.5 -mt-2.5 h-5 text-red-500">{localError}</div>

					<Field className={getFieldStyles(isEdit)}>
						<div className="flex justify-between">
							<FieldLabel>Id</FieldLabel>
							<CopyButton value={profile.id} />
						</div>
						{isEdit ? (
							<Input className={inputTextStyles} value={profile.id} disabled />
						) : (
							<div className="text-md">{profile.id}</div>
						)}
					</Field>

					<Field className={getFieldStyles(isEdit)}>
						<div className="flex justify-between">
							<FieldLabel>Full name</FieldLabel>
							<CopyButton value={fullName} />
						</div>
						{isEdit ? (
							<Input
								className={inputTextStyles}
								value={fullName}
								disabled={isUpdating}
								onChange={(event) => setFullName(event.currentTarget.value)}
							/>
						) : (
							<div className="text-md">{fullName}</div>
						)}
					</Field>

					<Field className={getFieldStyles(isEdit)}>
						<div className="flex justify-between">
							<FieldLabel>Email</FieldLabel>
							<CopyButton value={email} />
						</div>
						{isEdit ? (
							<Input
								className={inputTextStyles}
								type="email"
								value={email}
								disabled={isUpdating}
								onChange={(event) => setEmail(event.currentTarget.value)}
							/>
						) : (
							<div className="text-md">{email}</div>
						)}
					</Field>
          
          {/* Role selection dropdown */}
					<div className="flex gap-4">
						<Field className={cn(getFieldStyles(isEdit), "flex-1")}>
							<div className="flex justify-between">
								<FieldLabel>Role</FieldLabel>
								<CopyButton value={roleName} />
							</div>
							{isEdit ? (
								<Select
									value={roleId}
									onValueChange={(value) => {
										if (
											value &&
											availableRoles.some((availableRole) => availableRole.id === value)
										) {
											setRoleId(value);
										}
									}}
									disabled={isUpdating}
								>
									<SelectTrigger className={cn(inputTextStyles, "w-full")}>
										<SelectValue>{roleName}</SelectValue>
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{availableRoles.map((accountRole) => (
												<SelectItem key={accountRole.id} value={accountRole.id}>
													{accountRole.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							) : (
								<div className="text-md">{roleName}</div>
							)}
						</Field>
            {/* End of role selection dropdown */}

						<Field className={cn(getFieldStyles(isEdit), "flex-1")}>
							<div className="flex justify-between">
								<FieldLabel>Created</FieldLabel>
								<CopyButton value={profile.created_at} />
							</div>
							{isEdit ? (
								<Input
									className={inputTextStyles}
									value={new Date(profile.created_at).toLocaleDateString()}
									disabled
								/>
							) : (
								<div className="text-md">{new Date(profile.created_at).toLocaleDateString()}</div>
							)}
						</Field>
					</div>
				</FieldGroup>
			</FieldSet>

      {/* Form's bottom actions */}
			<div className="mt-6 flex justify-end gap-2">
				<Button type="button" variant="secondary" onClick={onOpenChange}>
					Close
				</Button>
				{!isEdit ? (
					<Button type="button" onClick={() => setIsEdit(true)}>
						Edit
					</Button>
				) : (
					<>
						<Button
							type="button"
							variant="destructive"
							disabled={isUpdating}
							onClick={() => {
								resetInputs();
								setIsEdit(false);
							}}
						>
							Cancel
						</Button>
						<Button className="w-30" type="submit" disabled={isUpdating}>
							{isUpdating ? "Saving..." : "Save Changes"}
						</Button>
					</>
				)}
			</div>
		</form>
	);
}
