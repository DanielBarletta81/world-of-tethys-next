'use client';

import { Auth0Provider } from '@auth0/nextjs-auth0/client';

export default function AuthAppProvider({ user, children }) {
  return <Auth0Provider user={user}>{children}</Auth0Provider>;
}
