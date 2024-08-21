"use strict";

import { ReactNode, ReactElement, } from 'react';
import { AppRouterCacheProvider, } from '@mui/material-nextjs/v13-appRouter';

const Template = ({ children, }: { children: ReactNode; }): ReactElement =>
{
    return (

        <AppRouterCacheProvider>
            {children}
        </AppRouterCacheProvider>
    );
};

export default Template;
