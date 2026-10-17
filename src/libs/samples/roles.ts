import { downloadCsvFile, } from "@/libs/sample";

export function downloadRoleImportSample (): void
{
    downloadCsvFile ("roles_import_sample.csv", [
        [ "name", "guard_name", "permissions", ],
        [ "custom-editor", "web", "user.view,user.create", ],
    ]);
}
