export const AuthErrors = {
    PASSWORD_RECOVERY_CODE_INVALID: {
        message: 'Recovery code is invalid or has expired',
        field: 'recoveryCode',
        status: 400,
    },
    EMAIL_CONFIRMATION_PROBLEM: {
        message: 'Something wrong with email confirmation. Code is confirmed already or expirtationDate has expired',
        field: 'code',
        status: 400,
    },
    ACCOUNT_ALREADY_CONFIRMED: {
        message: 'Your account is already confirmed',
        field: 'code',
        status: 400,
    },
    EMAIL_ALREADY_CONFIRMED: {
        message: 'Your email is already confirmed',
        field: 'email',
        status: 400,
    },
    ACCOUNT_WAS_NOT_CREATED: {
        message: 'Email sending failed. Registration rolled back.',
        field: 'email',
        status: 400,
    },
};

export function getDeviceInfo(userAgent: string = ''): {
    deviceType: string;
    deviceName: string | null;
} {
    let deviceType = 'Other';
    let deviceName: string | null = null;

    if (/android/i.test(userAgent)) {
        deviceType = 'Mobile';
        const match = userAgent.match(/\((?:Linux; )?Android.*?; ([^)]+)\)/i);
        if (match && match[1]) deviceName = match[1].trim();
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        deviceType = 'Mobile';
        deviceName = /iPhone/i.test(userAgent) ? 'iPhone' : /iPad/i.test(userAgent) ? 'iPad' : 'iOS Device';
    } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
        deviceType = 'Mac';
        deviceName = 'Mac OS';
    } else if (/Windows NT/i.test(userAgent)) {
        deviceType = 'PC';
        deviceName = 'Windows';
    } else if (/Linux/i.test(userAgent)) {
        deviceType = 'PC';
        deviceName = 'Linux';
    }

    return { deviceType, deviceName };
}