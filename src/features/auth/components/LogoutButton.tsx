"use client";

import { logoutAction } from "../actions/logout-action";

export function LogoutButton() {
    return (
        <form action={logoutAction}>
            <button
                type='submit'
                className='px-4 py-2 text-sm font-medium cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
            >
                Logout
            </button>
        </form>
    );
}
