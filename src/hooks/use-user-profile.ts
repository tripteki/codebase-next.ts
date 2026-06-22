import { useCallback, useState, } from "react";
import { useSession, } from "next-auth/react";

import {
    appendFormMethodOverride,
    buildPersonalSettingsFormData,
} from "@/libs/admin-form-data";
import type { AdminActionResult, } from "@/libs/call-message";
import {
    extractApiData,
    resultFromCall,
} from "@/libs/call-message";
import { call, } from "@/libs/call";
import type {
    PersonalSettingsPayload,
    UserMeDto,
} from "@/types/admin/settings";

export function useUserProfile () {
    const [isLoading, setIsLoading] = useState (false);
    const [isSaving, setIsSaving] = useState (false);
    const { update, } = useSession ();

    const fetchMe = useCallback (async (): Promise<AdminActionResult<UserMeDto>> => {
        setIsLoading (true);

        const result = await call ({
            url: "/api/v1/users/me",
            method: "GET",
        });

        setIsLoading (false);

        return resultFromCall<UserMeDto>(result, "Something went wrong.");
    }, []);

    const fetchInterestSuggestions = useCallback (async (): Promise<string[]> => {
        const result = await call ({
            url: "/api/v1/users/me/interests",
            method: "GET",
        });

        if (! result.isSuccess) {
            return [];
        }

        return extractApiData<string[]>(result.data) ?? [];
    }, []);

    const updatePersonal = useCallback (async (
        payload: PersonalSettingsPayload,
        avatar?: File | null
    ): Promise<AdminActionResult<UserMeDto>> => {
        setIsSaving (true);

        const result = avatar
            ? await call ({
                  url: "/api/v1/users/me",
                  method: "POST",
                  data: appendFormMethodOverride (
                      buildPersonalSettingsFormData (payload, avatar)
                  ),
              })
            : await call ({
                  url: "/api/v1/users/me",
                  method: "PUT",
                  data: payload,
              });

        setIsSaving (false);

        const actionResult = resultFromCall<UserMeDto>(
            result,
            "Something went wrong."
        );

        if (actionResult.success) {
            await update ();
        }

        return actionResult;
    }, [update]);

    return {
        isLoading,
        isSaving,
        fetchMe,
        fetchInterestSuggestions,
        updatePersonal,
    };
}
