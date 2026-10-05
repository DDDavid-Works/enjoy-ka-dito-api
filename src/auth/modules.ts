import { SetMetadata } from '@nestjs/common'

// The admin areas a user can be given access to. Add new modules here and tick them per user.
export enum AppModule {
  Inquiries = 'inquiries',
  Quotations = 'quotations',
  Packages = 'packages',
  Hotels = 'hotels',
  Company = 'company',
  Users = 'users',
}

export const ALL_MODULES = Object.values(AppModule)

export const MODULES_KEY = 'requiredModules'

/** Allows the request if the user has at least one of the given modules. */
export const RequireModules = (...modules: AppModule[]) => SetMetadata(MODULES_KEY, modules)
