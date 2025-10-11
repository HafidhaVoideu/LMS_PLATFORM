import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";

// import { reactClient } from "better-auth/client/plugins/react";
export const authClient = createAuthClient({
  plugins: [emailOTPClient(), adminClient()],
});
