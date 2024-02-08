"use strict";

import moment from "moment";
import configuration from "../next-i18next.config";

export default () =>
{
    const instance = moment ();

    instance.locale (configuration.i18n.defaultLocale);
    instance.format ('DD-MM-YYYYY hh:mm:ss');

    return instance;
};
