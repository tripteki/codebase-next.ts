import { downloadCsvFile, } from "@/libs/sample";

export function downloadUserImportSample (): void
{
    downloadCsvFile ("users_import_sample.csv", [
        [ "name", "full_name", "email", "password", "status", ],
        [ "User One", "User One", "user1@example.com", "Password123!", "active", ],
        [ "User Two", "User Two", "user2@example.com", "Password123!", "unverified", ],
    ]);
}
