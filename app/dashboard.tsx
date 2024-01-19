"use strict";

import { Component, Fragment, } from "react";
import { AppRouterCacheProvider, } from "@mui/material-nextjs/v13-appRouter";

// LifecycleMethods //

export default class extends Component
{
    // Mounting //

    constructor (props)
    {
        super (props);

        // this.state = {};
        // this.function = this.function.bind (this);
    }

    // function ()
    // {
        //
    // }

    render ()
    {
        const { children, } = this.props;

        return (

            <Fragment>
                <AppRouterCacheProvider>
                    {children}
                </AppRouterCacheProvider>
            </Fragment>
        );
    }

    componentDidMount ()
    {
        //
    }

    // Updating //

    getSnapshotBeforeUpdate (prevProps, prevState)
    {
        return null;
    }

    componentDidUpdate ()
    {
        //
    }

    // Unmounting //

    componentWillUnmount ()
    {
        //
    }
};
