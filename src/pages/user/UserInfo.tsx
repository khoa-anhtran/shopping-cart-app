// UserInfoPage.tsx
import React, { useState, useCallback, useEffect } from "react";
// Adjust this import to your real hook / context / Redux selector
import useUserInfo from "@/hooks/useUserInfo";
import { postUpdateUserInfo } from "@/services/userService";
import { postGetImageSignature, postUploadImage } from "@/services/uploadService";

const UserInfo: React.FC = () => {
    const { avatar, name, email, userId } = useUserInfo();

    const [localname, setName] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Sync local state when user changes
    useEffect(() => {
        setName(name ?? "");
        setAvatarPreview(avatar ?? null);
    }, [name, avatar]);

    const onAvatarChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setAvatarFile(file);
            const url = URL.createObjectURL(file);
            setAvatarPreview(url);
        },
        []
    );

    const onSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setError(null);
            setSuccess(null);

            try {
                const payload = { name: localname ?? "" } as { name: string, avatar?: string }

                if (avatarFile) {
                    const res = await postGetImageSignature("12312312")

                    const { apiKey, cloudName, folder, signature, timestamp } = res

                    const fd = new FormData();
                    fd.append("file", avatarFile);
                    fd.append("api_key", apiKey);
                    fd.append("timestamp", String(timestamp));
                    fd.append("folder", folder);
                    fd.append("signature", signature);

                    const urlObject = await postUploadImage(cloudName, fd)

                    payload.avatar = urlObject.url
                }
                
                await postUpdateUserInfo(userId ?? "", payload)
                setSuccess("Profile updated successfully.");
            } catch {
                setError("Failed to update profile.");
            }
        },
        [avatarFile, userId, localname]
    );

    if (!email) {
        return (
            <div className="max-w-xl">
                <p className="text-sm text-gray-500">You must be logged in to view this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full flex flex-col items-center">
            <header className="self-start">
                <h1 className="text-xl font-semibold">User Info</h1>
                <p className="text-sm text-gray-500">
                    View and update your basic profile information.
                </p>
            </header>

            <form onSubmit={onSubmit} className="space-y-6 bg-white rounded border p-4 w-[60%]">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-xs text-gray-500">No avatar</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Avatar</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onAvatarChange}
                            className="text-sm"
                        />
                        <p className="text-xs text-gray-400">
                            JPG, PNG or GIF. Max 2 MB (or your real limit).
                        </p>
                    </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium" htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500/50"
                        value={localname}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                    />
                </div>

                {/* Email (read-only example) */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        className="w-full rounded border px-3 py-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                        value={email ?? ""}
                        disabled
                    />
                    <p className="text-xs text-gray-400">
                        Email cannot be changed here.
                    </p>
                </div>

                {/* Status messages */}
                {error && (
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-sm text-green-600">
                        {success}
                    </p>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="px-3 py-2 text-sm rounded border text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                            // reset to original user values
                            setName(name ?? "");
                            setAvatarFile(null);
                            setAvatarPreview(avatar ?? null);
                            setError(null);
                            setSuccess(null);
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        // disabled={isUpdating}
                        className="px-4 py-2 text-sm font-medium rounded bg-blue-600 text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-blue-700"
                    >
                        Save changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserInfo;
