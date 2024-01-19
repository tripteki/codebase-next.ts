"use strict";

import { Fragment, useState, useEffect, } from "react";
import { AppRouterCacheProvider, } from "@mui/material-nextjs/v13-appRouter";

export default ({ children, }) =>
{
    // Hooks //

    // Mounting //

    // const [ ..., set..., ] = useState (0);
    // const [ ..., set..., ] = useState ({});
    // const ... = () => {};

    useEffect(() => {

        // componentDidMount //
    }, []);

    // Updating //

    useEffect(() => {

        // componentDidUpdate //
    }, [ /** ... **/ ]);

    // Unmounting //

    useEffect(() => {

        // componentWillUnmount //

        return () => {};

    }, [ /** ... **/ ]);

    return (

        <Fragment>
            <AppRouterCacheProvider>
                {children}
            </AppRouterCacheProvider>
        </Fragment>
    );
};
