"use strict";

import { ThemeProvider, } from "@material-tailwind/react";

const Template = ({ children, }) =>
{
    return (

        <ThemeProvider>
            {children}
        </ThemeProvider>
    );
};

export default Template;
