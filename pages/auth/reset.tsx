"use strict";

import { Fragment, } from "react";

const Template = () =>
{
    return (

        <Fragment>
        <div className="container mx-auto">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm light:bg-neutral-900 light:border-neutral-700">
                <div className="p-4 sm:p-7">
                    <div className="mt-5">
                    {/* Form */}
                    <form>
                        <div className="grid gap-y-4">
                        {/* E-Mail Form */}
                        <div>
                            <label htmlFor="email" className="block text-sm mb-2 light:text-white">E-Mail</label>
                            <div className="relative">
                            <input type="email" id="email" name="email" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none light:bg-neutral-900 light:border-neutral-700 light:text-neutral-400 light:placeholder-neutral-500 light:focus:ring-neutral-600" required aria-describedby="email-error" />
                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                </svg>
                            </div>
                            </div>
                            <p className="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
                        </div>
                        {/* E-Mail Form */}

                        {/* New Password Form */}
                        <div>
                            <label htmlFor="password" className="block text-sm mb-2 light:text-white">New Password</label>
                            <div className="relative">
                            <input type="password" id="password" name="password" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none light:bg-neutral-900 light:border-neutral-700 light:text-neutral-400 light:placeholder-neutral-500 light:focus:ring-neutral-600" required aria-describedby="password-error" />
                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                </svg>
                            </div>
                            </div>
                            <p className="hidden text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
                        </div>
                        {/* New Password Form */}

                        {/* New Password Confirmation Form */}
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm mb-2 light:text-white">New Password Confirmation</label>
                            <div className="relative">
                            <input type="password" id="confirm-password" name="confirm-password" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none light:bg-neutral-900 light:border-neutral-700 light:text-neutral-400 light:placeholder-neutral-500 light:focus:ring-neutral-600" required aria-describedby="confirm-password-error" />
                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                </svg>
                            </div>
                            </div>
                            <p className="hidden text-xs text-red-600 mt-2" id="confirm-password-error">Password does not match the password</p>
                        </div>
                        {/* New Password Confirmation Form */}

                        <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Reset</button>
                        </div>
                    </form>
                    {/* End Form */}
                    </div>
                </div>
            </div>
        </div>
        </Fragment>
    );
};

export default Template;
