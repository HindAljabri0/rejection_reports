export class SwitchUser {
    switchUserId?: string;
    role?: {
        roleId?: number;
        description?: string;
        rolePrivileges?: [
            {
                id?: {
                    source?: number;
                    destination?: number;
                    transactionId?: number;
                    roleId?: number
                }
            }
        ]
    };
    firstName?: string;
    lastName?: string;
    lastModifiedDate?: Date;
    password?: string;
    email?: string;
    isEnabled?: string;
    isBillable?: string;
    lastSeenFrom?: string
}