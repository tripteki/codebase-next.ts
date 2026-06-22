import type {
    PersonalSettingsPayload,
} from "@/types/admin/settings";

export function appendFormMethodOverride (
    formData: FormData,
    method: "PUT" | "PATCH" = "PUT"
): FormData {
    formData.append ("_method", method);

    return formData;
}

export function buildPersonalSettingsFormData (
    payload: PersonalSettingsPayload,
    avatar?: File | null
): FormData {
    const formData = new FormData ();
    formData.append ("name", payload.name);
    formData.append ("email", payload.email);
    formData.append ("full_name", payload.full_name ?? "");

    payload.interests.forEach ((interest, index) => {
        formData.append (`interests[${index}]`, interest);
    });

    if (payload.password?.trim ()) {
        formData.append ("password", payload.password);
        formData.append (
            "password_confirmation",
            payload.password_confirmation ?? ""
        );
    }

    if (avatar) {
        formData.append ("avatar", avatar);
    }

    return formData;
}
