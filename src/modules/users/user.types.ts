export interface PublicUser {
  id: string;
  name: string;
  email: string;
  currency: string;
  notifications: { budgetAlerts: boolean };
}

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
}

export interface UpdateProfileInput {
  name?: string;
}

export interface UpdateSettingsInput {
  currency?: string;
  notifications?: { budgetAlerts?: boolean };
}
