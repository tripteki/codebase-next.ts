import { type ReactElement, } from "react";

const I18nFlag = ({ locale, }: { locale: string; }): ReactElement =>
{
    if (locale === "en")
    {
        return (
            <svg className="h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1900 1000" aria-hidden="true">
                <rect width="1900" height="1000" fill="#B22234" />
                <rect y="76.923" width="1900" height="76.923" fill="#fff" />
                <rect y="230.769" width="1900" height="76.923" fill="#fff" />
                <rect y="384.615" width="1900" height="76.923" fill="#fff" />
                <rect y="538.461" width="1900" height="76.923" fill="#fff" />
                <rect y="692.307" width="1900" height="76.923" fill="#fff" />
                <rect y="846.153" width="1900" height="76.923" fill="#fff" />
                <rect width="760" height="538.462" fill="#3C3B6E" />
            </svg>
        );
    }

    if (locale === "id")
    {
        return (
            <svg className="h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" aria-hidden="true">
                <rect width="900" height="300" fill="#CE1126" />
                <rect y="300" width="900" height="300" fill="#fff" />
            </svg>
        );
    }

    if (locale === "ms")
    {
        return (
            <svg className="h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 700" aria-hidden="true">
                <rect width="1400" height="700" fill="#fff" />
                <rect y="0" width="1400" height="50" fill="#CC0001" />
                <rect y="100" width="1400" height="50" fill="#CC0001" />
                <rect y="200" width="1400" height="50" fill="#CC0001" />
                <rect y="300" width="1400" height="50" fill="#CC0001" />
                <rect y="400" width="1400" height="50" fill="#CC0001" />
                <rect y="500" width="1400" height="50" fill="#CC0001" />
                <rect y="600" width="1400" height="50" fill="#CC0001" />
                <rect width="700" height="400" fill="#010066" />
                <circle cx="280" cy="200" r="115" fill="#FFCC00" />
                <circle cx="320" cy="200" r="95" fill="#010066" />
            </svg>
        );
    }

    return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="#fff" d="M0 0h640v480H0z" />
        </svg>
    );
};

export default I18nFlag;
