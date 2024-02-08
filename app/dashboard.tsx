"use strict";

import { Fragment, } from "react";
import { AppRouterCacheProvider, } from "@mui/material-nextjs/v13-appRouter";

export default ({ children, }) =>
{
    return (

        <Fragment>
            <AppRouterCacheProvider>
                {children}
            </AppRouterCacheProvider>
        </Fragment>
    );
};
