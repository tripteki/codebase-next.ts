import type { AdminSettingDraft, AdminSettingRowPayload, } from "@/types/admin/setting";

type PreparedSettingRow = {
    payload: AdminSettingRowPayload;
    file: File | null;
};

function prepareSettingsRows (rows: AdminSettingDraft[]): PreparedSettingRow[]
{
    const prepared: PreparedSettingRow[] = [];

    for (const row of rows)
    {
        if (row.remove)
        {
            if (row.id)
            {
                prepared.push ({
                    payload: { id: row.id, key: "", value: "", value_kind: "text", },
                    file: null,
                });
            }

            continue;
        }

        const key = row.key.trim ();
        const value = row.value ?? "";
        const file = row.file instanceof File && row.file.size > 0 ? row.file : null;

        if (! key && ! value && ! file)
        {
            continue;
        }

        prepared.push ({
            payload: {
                ...(row.id ? { id: row.id, } : {}),
                key,
                value,
                value_kind: row.value_kind === "file" ? "file" : "text",
            },
            file: row.value_kind === "file" ? file : null,
        });
    }

    return prepared;
}

export function settingsUseMultipart (rows: AdminSettingDraft[]): boolean
{
    return prepareSettingsRows (rows).some ((row) => row.file || (row.payload.value_kind === "file" && ! row.payload.id));
}

export function buildSettingsPayload (rows: AdminSettingDraft[]): { rows: AdminSettingRowPayload[]; }
{
    return { rows: prepareSettingsRows (rows).map ((row) => row.payload), };
}

export function buildSettingsFormData (rows: AdminSettingDraft[]): FormData
{
    const formData = new FormData ();

    prepareSettingsRows (rows).forEach ((row, index) =>
    {
        if (row.payload.id)
        {
            formData.append (`rows[${index}][id]`, row.payload.id);
        }

        formData.append (`rows[${index}][key]`, row.payload.key);
        formData.append (`rows[${index}][value]`, row.payload.value);
        formData.append (`rows[${index}][value_kind]`, row.payload.value_kind);

        if (row.file)
        {
            formData.append (`rows[${index}][file]`, row.file);
        }
    });

    return formData;
}
