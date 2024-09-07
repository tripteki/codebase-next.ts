"use strict";

import { ReactNode, ReactElement, Fragment, } from 'react';

const Template = ({ children, }: { children: ReactNode; }): ReactElement =>
{
    return (

        <Fragment>
            {children}
        </Fragment>
    );
};

export default Template;
