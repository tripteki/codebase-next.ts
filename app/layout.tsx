"use strict";

import React, { ReactElement, } from "react";
import { AppRouterCacheProvider, } from "@mui/material-nextjs/v13-appRouter";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FavoriteIcon from "@mui/icons-material/Favorite";

const RootLayout = ({ children, }: { children: React.ReactNode; }): ReactElement =>
{
    return (

        <>
            <Box justifyContent="center" alignItems="center" minHeight="100vh">
                <AppBar>
                    <Toolbar>
                        <Typography>...</Typography>
                    </Toolbar>
                </AppBar>
                <Paper sx={{ mt: 10, p: 2, }}>
                <AppRouterCacheProvider>
                    {children}
                </AppRouterCacheProvider>
                </Paper>
            </Box>
            <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0, }}>
                <BottomNavigation showLabels>
                    <BottomNavigationAction label="..." icon={<FavoriteIcon />} />
                </BottomNavigation>
            </Box>
        </>
    );
};

export default RootLayout;
