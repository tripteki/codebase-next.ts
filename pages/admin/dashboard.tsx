"use strict";

import { Fragment, } from "react";

const Template = () =>
{
    return (

        <Fragment>
            <div className="container m-2">
                <button type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400">Sign out</button>
            </div>
        </Fragment>
    );
};

export default Template;
