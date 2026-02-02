
# Installation

Learn how to configure Better Auth in your project.



<Steps>
  <Step>
    ### Install the Package

    Let's start by adding Better Auth to your project:

    <CodeBlockTabs defaultValue="npm" groupId="persist-install" persist>
      <CodeBlockTabsList>
        <CodeBlockTabsTrigger value="npm">
          npm
        </CodeBlockTabsTrigger>

        <CodeBlockTabsTrigger value="pnpm">
          pnpm
        </CodeBlockTabsTrigger>

        <CodeBlockTabsTrigger value="yarn">
          yarn
        </CodeBlockTabsTrigger>

        <CodeBlockTabsTrigger value="bun">
          bun
        </CodeBlockTabsTrigger>
      </CodeBlockTabsList>

      <CodeBlockTab value="npm">
        ```bash
        npm install better-auth
        ```
      </CodeBlockTab>

      <CodeBlockTab value="pnpm">
        ```bash
        pnpm add better-auth
        ```
      </CodeBlockTab>

      <CodeBlockTab value="yarn">
        ```bash
        yarn add better-auth
        ```
      </CodeBlockTab>

      <CodeBlockTab value="bun">
        ```bash
        bun add better-auth
        ```
      </CodeBlockTab>
    </CodeBlockTabs>

    <Callout type="info">
      If you're using a separate client and server setup, make sure to install Better Auth in both parts of your project.
    </Callout>
  </Step>

  <Step>
    ### Set Environment Variables

    Create a `.env` file in the root of your project and add the following environment variables:

    1. **Secret Key**

    A secret value used for encryption and hashing. It must be at least 32 characters and generated with high entropy. Click the button below to generate one. You can also use `openssl rand -base64 32` to generate one.

    ```txt title=".env"
    BETTER_AUTH_SECRET=
    ```

    <GenerateSecret />

    2. **Set Base URL**

    ```txt title=".env"
    BETTER_AUTH_URL=http://localhost:3000 # Base URL of your app
    ```
  </Step>

  <Step>
    ### Create A Better Auth Instance

    Create a file named `auth.ts` in one of these locations:

    * Project root
    * `lib/` folder
    * `utils/` folder

    You can also nest any of these folders under `src/`, `app/` or `server/` folder. (e.g. `src/lib/auth.ts`, `app/lib/auth.ts`).

    And in this file, import Better Auth and create your auth instance. Make sure to export the auth instance with the variable name `auth` or as a `default` export.

    ```ts title="auth.ts"
    import { betterAuth } from "better-auth";

    export const auth = betterAuth({
      //...
    });
    ```
  </Step>

  <Step>
    ### Configure Database

    Better Auth requires a database to store user data.
    You can easily configure Better Auth to use SQLite, PostgreSQL, or MySQL, and more!

    <Callout>
      You can also configure Better Auth to work in a stateless mode if you don't configure a database. See [Stateless Session Management](/docs/concepts/session-management#stateless-session-management) for more information. Note that most plugins will require a database.
    </Callout>

    <Tabs items={["sqlite", "postgres", "mysql"]}>
      <Tab value="sqlite">
        ```ts title="auth.ts"
        import { betterAuth } from "better-auth";
        import Database from "better-sqlite3";

        export const auth = betterAuth({
            database: new Database("./sqlite.db"),
        })
        ```
      </Tab>

      <Tab value="postgres">
        ```ts title="auth.ts"
        import { betterAuth } from "better-auth";
        import { Pool } from "pg";

        export const auth = betterAuth({
            database: new Pool({
                // connection options
            }),
        })
        ```
      </Tab>

      <Tab value="mysql">
        ```ts title="auth.ts"
        import { betterAuth } from "better-auth";
        import { createPool } from "mysql2/promise";

        export const auth = betterAuth({
            database: createPool({
                // connection options
            }),
        })
        ```
      </Tab>
    </Tabs>

    Alternatively, if you prefer to use an ORM, you can use one of the built-in adapters.

    <Tabs items={["drizzle", "prisma", "mongodb"]}>
      <Tab value="drizzle">
        ```ts title="auth.ts"
        import { betterAuth } from "better-auth";
        import { drizzleAdapter } from "better-auth/adapters/drizzle";
        import { db } from "@/db"; // your drizzle instance

        export const auth = betterAuth({
            database: drizzleAdapter(db, {
                provider: "pg", // or "mysql", "sqlite"
            }),
        });
        ```
      </Tab>

      <Tab value="prisma">
        ```ts title="auth.ts"
        import { betterAuth } from "better-auth";
        import { prismaAdapter } from "better-auth/adapters/prisma";
        // If your Prisma file is located elsewhere, you can change the path
        import { PrismaClient } from "@/generated/prisma/client";

        const prisma = new PrismaClient();
        export const auth = betterAuth({
            database: prismaAdapter(prisma, {
                provider: "sqlite", // or "mysql", "postgresql", ...etc
            }),
        });
        ```
      </Tab>

      <Tab value="mongodb">
        ```ts title="auth.ts"
        import { betterAuth } from "better-auth";
        import { mongodbAdapter } from "better-auth/adapters/mongodb";
        import { client } from "@/db"; // your mongodb client

        export const auth = betterAuth({
            database: mongodbAdapter(client),
        });
        ```
      </Tab>
    </Tabs>

    <Callout>
      If your database is not listed above, check out our other supported
      [databases](/docs/adapters/other-relational-databases) for more information,
      or use one of the supported ORMs.
    </Callout>
  </Step>

  <Step>
    ### Create Database Tables

    Better Auth includes a CLI tool to help manage the schema required by the library.

    * **Generate**: This command generates an ORM schema or SQL migration file.

    <Callout>
      If you're using Kysely, you can apply the migration directly with `migrate` command below. Use `generate` only if you plan to apply the migration manually.
    </Callout>

    ```bash title="Terminal"
    npx @better-auth/cli generate
    ```

    * **Migrate**: This command creates the required tables directly in the database. (Available only for the built-in Kysely adapter)

    ```bash title="Terminal"
    npx @better-auth/cli migrate
    ```

    see the [CLI documentation](/docs/concepts/cli) for more information.

    <Callout>
      If you instead want to create the schema manually, you can find the core schema required in the [database section](/docs/concepts/database#core-schema).
    </Callout>
  </Step>

  <Step>
    ### Authentication Methods

    Configure the authentication methods you want to use. Better Auth comes with built-in support for email/password, and social sign-on providers.

    ```ts title="auth.ts"
    import { betterAuth } from "better-auth";

    export const auth = betterAuth({
      //...other options // [!code highlight]
      emailAndPassword: { // [!code highlight]
        enabled: true, // [!code highlight]
      }, // [!code highlight]
      socialProviders: { // [!code highlight]
        github: { // [!code highlight]
          clientId: process.env.GITHUB_CLIENT_ID as string, // [!code highlight]
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string, // [!code highlight]
        }, // [!code highlight]
      }, // [!code highlight]
    });
    ```

    <Callout type="info">
      You can use even more authentication methods like [passkey](/docs/plugins/passkey), [username](/docs/plugins/username), [magic link](/docs/plugins/magic-link) and more through plugins.
    </Callout>
  </Step>

  <Step>
    ### Mount Handler

    To handle API requests, you need to set up a route handler on your server.

    Create a new file or route in your framework's designated catch-all route handler. This route should handle requests for the path `/api/auth/*` (unless you've configured a different base path).

    <Callout>
      Better Auth supports any backend framework with standard Request and Response
      objects and offers helper functions for popular frameworks.
    </Callout>

    <Tabs items={["next-js-app-router", "next-js-pages-router", "nuxt", "svelte-kit", "remix", "solid-start", "hono", "cloudflare-workers", "express", "elysia", "tanstack-start", "expo"]} defaultValue="next-js-app-router">
      <Tab value="next-js-app-router">
        ```ts title="/app/api/auth/[...all]/route.ts"
        import { auth } from "@/lib/auth"; // path to your auth file
        import { toNextJsHandler } from "better-auth/next-js";

        export const { POST, GET } = toNextJsHandler(auth);
        ```
      </Tab>

      <Tab value="next-js-pages-router">
        ```ts title="/pages/api/auth/[...all].ts"
        import { auth } from "@/lib/auth"; // path to your auth file
        import { toNodeHandler } from "better-auth/node";

        // Disallow body parsing, we will parse it manually
        export const config = { api: { bodyParser: false } };
        export default toNodeHandler(auth.handler);
        ```
      </Tab>

      <Tab value="nuxt">
        ```ts title="/server/api/auth/[...all].ts"
        import { auth } from "~/utils/auth"; // path to your auth file

        export default defineEventHandler((event) => {
            return auth.handler(toWebRequest(event));
        });
        ```
      </Tab>

      <Tab value="svelte-kit">
        ```ts title="hooks.server.ts"
        import { auth } from "$lib/auth"; // path to your auth file
        import { svelteKitHandler } from "better-auth/svelte-kit";
        import { building } from '$app/environment'

        export async function handle({ event, resolve }) {
            return svelteKitHandler({ event, resolve, auth, building });
        }
        ```
      </Tab>

      <Tab value="remix">
        ```ts title="/app/routes/api.auth.$.ts"
        import { auth } from '~/lib/auth.server' // Adjust the path as necessary
        import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node"

        export async function loader({ request }: LoaderFunctionArgs) {
            return auth.handler(request)
        }

        export async function action({ request }: ActionFunctionArgs) {
            return auth.handler(request)
        }
        ```
      </Tab>

      <Tab value="solid-start">
        ```ts title="/routes/api/auth/*all.ts"
        import { auth } from "~/lib/auth"; // path to your auth file
        import { toSolidStartHandler } from "better-auth/solid-start";

        export const { GET, POST } = toSolidStartHandler(auth);
        ```
      </Tab>

      <Tab value="hono">
        ```ts title="src/index.ts"
        import { Hono } from "hono";
        import { auth } from "./auth"; // path to your auth file
        import { serve } from "@hono/node-server";
        import { cors } from "hono/cors";

        const app = new Hono();

        app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

        serve(app);
        ```
      </Tab>

      <Tab value="cloudflare-workers">
        ```ts title="src/index.ts"
        import { auth } from "./auth"; // path to your auth file

        export default {
            async fetch(request: Request) {
                const url = new URL(request.url);

                // Handle auth routes
                if (url.pathname.startsWith("/api/auth")) {
                    return auth.handler(request);
                }

                // Handle other routes
                return new Response("Not found", { status: 404 });
            },
        };
        ```

        <Callout type="info">
          **Node.js AsyncLocalStorage Support**: Better Auth uses AsyncLocalStorage for async context tracking. To enable this in Cloudflare Workers, add the `nodejs_compat` flag to your `wrangler.toml`:

          ```toml title="wrangler.toml"
          compatibility_flags = ["nodejs_compat"]
          compatibility_date = "2024-09-23"
          ```

          Alternatively, if you only need AsyncLocalStorage support:

          ```toml title="wrangler.toml"
          compatibility_flags = ["nodejs_als"]
          ```

          In the next major release, we will assume AsyncLocalStorage support by default, so this configuration will be necessary.
        </Callout>
      </Tab>

      <Tab value="express">
        <Callout type="warn">
          ExpressJS v5 introduced breaking changes to route path matching by switching to `path-to-regexp@6`. Wildcard routes like `*` should now be written using the new named syntax, e.g. `/{*any}`, to properly capture catch-all patterns. This ensures compatibility and predictable behavior across routing scenarios.
          See the [Express v5 migration guide](https://expressjs.com/en/guide/migrating-5.html) for details.

          As a result, the implementation in ExpressJS v5 should look like this:

          ```ts
          app.all('/api/auth/{*any}', toNodeHandler(auth));
          ```

          *The name any is arbitrary and can be replaced with any identifier you prefer.*
        </Callout>

        ```ts title="server.ts"
        import express from "express";
        import { toNodeHandler } from "better-auth/node";
        import { auth } from "./auth";

        const app = express();
        const port = 8000;

        app.all("/api/auth/*", toNodeHandler(auth));

        // Mount express json middleware after Better Auth handler
        // or only apply it to routes that don't interact with Better Auth
        app.use(express.json());

        app.listen(port, () => {
            console.log(`Better Auth app listening on port ${port}`);
        });
        ```

        This will also work for any other node server framework like express, fastify, hapi, etc., but may require some modifications. See [fastify guide](/docs/integrations/fastify). Note that CommonJS (cjs) isn't supported.
      </Tab>

      <Tab value="astro">
        ```ts title="/pages/api/auth/[...all].ts"
        import type { APIRoute } from "astro";
        import { auth } from "@/auth"; // path to your auth file

        export const GET: APIRoute = async (ctx) => {
            return auth.handler(ctx.request);
        };

        export const POST: APIRoute = async (ctx) => {
            return auth.handler(ctx.request);
        };
        ```
      </Tab>

      <Tab value="elysia">
        ```ts
        import { Elysia, Context } from "elysia";
        import { auth } from "./auth";

        const betterAuthView = (context: Context) => {
            const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
            // validate request method
            if(BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
                return auth.handler(context.request);
            } else {
                context.error(405)
            }
        }

        const app = new Elysia().all("/api/auth/*", betterAuthView).listen(3000);

        console.log(
        `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
        );
        ```
      </Tab>

      <Tab value="tanstack-start">
        ```ts title="src/routes/api/auth/$.ts"
        import { auth } from '@/lib/auth'
        import { createFileRoute } from '@tanstack/react-router'

        export const Route = createFileRoute('/api/auth/$')({
            server: {
                handlers: {
                    GET: async ({ request }:{ request: Request }) => {
                        return await auth.handler(request)
                    },
                    POST: async ({ request }:{ request: Request }) => {
                        return await auth.handler(request)
                    },
                },
            },
        })
        ```

        <Callout type="info">
          When you call functions that need to set cookies (like `signInEmail` or `signUpEmail`), you'll need to handle cookie setting for TanStack Start. Better Auth provides a `tanstackStartCookies` plugin to automatically handle this for you.

          For React (TanStack Start with React):

          ```ts title="src/lib/auth.ts"
          import { betterAuth } from "better-auth";
          import { tanstackStartCookies } from "better-auth/tanstack-start";

          export const auth = betterAuth({
              //...your config
              plugins: [tanstackStartCookies()] // make sure this is the last plugin in the array
          })
          ```

          For Solid.js (TanStack Start with Solid):

          ```ts title="src/lib/auth.ts"
          import { betterAuth } from "better-auth";
          import { tanstackStartCookies } from "better-auth/tanstack-start/solid";

          export const auth = betterAuth({
              //...your config
              plugins: [tanstackStartCookies()] // make sure this is the last plugin in the array
          })
          ```

          Now, when you call functions that set cookies, they will be automatically set using TanStack Start's cookie handling system.
        </Callout>
      </Tab>

      <Tab value="expo">
        ```ts title="app/api/auth/[...all]+api.ts"
        import { auth } from '@/lib/server/auth'; // path to your auth file

        const handler = auth.handler;
        export { handler as GET, handler as POST };
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step>
    ### Create Client Instance

    The client-side library helps you interact with the auth server. Better Auth comes with a client for all the popular web frameworks, including vanilla JavaScript.

    1. Import `createAuthClient` from the package for your framework (e.g., "better-auth/react" for React).
    2. Call the function to create your client.
    3. Pass the base URL of your auth server. (If the auth server is running on the same domain as your client, you can skip this step.)

    <Callout type="info">
      If you're using a different base path other than `/api/auth` make sure to pass
      the whole URL including the path. (e.g.
      `http://localhost:3000/custom-path/auth`)
    </Callout>

    <Tabs
      items={["react", "vue", "svelte", "solid",
"vanilla"]}
      defaultValue="react"
    >
      <Tab value="vanilla">
        ```ts title="lib/auth-client.ts"
        import { createAuthClient } from "better-auth/client"
        export const authClient = createAuthClient({
            /** The base URL of the server (optional if you're using the same domain) */ // [!code highlight]
            baseURL: "http://localhost:3000" // [!code highlight]
        })
        ```
      </Tab>

      <Tab value="react" title="lib/auth-client.ts">
        ```ts title="lib/auth-client.ts"
        import { createAuthClient } from "better-auth/react"
        export const authClient = createAuthClient({
            /** The base URL of the server (optional if you're using the same domain) */ // [!code highlight]
            baseURL: "http://localhost:3000" // [!code highlight]
        })
        ```
      </Tab>

      <Tab value="vue" title="lib/auth-client.ts">
        ```ts title="lib/auth-client.ts"
        import { createAuthClient } from "better-auth/vue"
        export const authClient = createAuthClient({
            /** The base URL of the server (optional if you're using the same domain) */ // [!code highlight]
            baseURL: "http://localhost:3000" // [!code highlight]
        })
        ```
      </Tab>

      <Tab value="svelte" title="lib/auth-client.ts">
        ```ts title="lib/auth-client.ts"
        import { createAuthClient } from "better-auth/svelte"
        export const authClient = createAuthClient({
            /** The base URL of the server (optional if you're using the same domain) */ // [!code highlight]
            baseURL: "http://localhost:3000" // [!code highlight]
        })
        ```
      </Tab>

      <Tab value="solid" title="lib/auth-client.ts">
        ```ts title="lib/auth-client.ts"
        import { createAuthClient } from "better-auth/solid"
        export const authClient = createAuthClient({
            /** The base URL of the server (optional if you're using the same domain) */ // [!code highlight]
            baseURL: "http://localhost:3000" // [!code highlight]
        })
        ```
      </Tab>
    </Tabs>

    <Callout type="info">
      Tip: You can also export specific methods if you prefer:
    </Callout>

    ```ts
    export const { signIn, signUp, useSession } = createAuthClient()
    ```
  </Step>

  <Step>
    ### 🎉 That's it!

    That's it! You're now ready to use better-auth in your application. Continue to [basic usage](/docs/basic-usage) to learn how to use the auth instance to sign in users.
  </Step>
</Steps>



# TikTok

TikTok provider setup and usage.



<Steps>
  <Step>
    ### Get your TikTok Credentials

    To integrate with TikTok, you need to obtain API credentials by creating an application in the [TikTok Developer Portal](https://developers.tiktok.com/apps).

    Follow these steps:

    1. Create an account on the TikTok Developer Portal
    2. Create a new application
    3. Set up a sandbox environment for testing
    4. Configure your redirect URL (must be HTTPS)
    5. Note your Client Secret and Client Key

    <Callout type="info">
      * The TikTok API does not work with localhost. You need to use a public domain for the redirect URL and HTTPS for local testing. You can use [NGROK](https://ngrok.com/) or another similar tool for this.
      * For testing, you will need to use the [Sandbox mode](https://developers.tiktok.com/blog/introducing-sandbox), which you can enable in the TikTok Developer Portal.
      * The default scope is `user.info.profile`. For additional scopes, refer to the [Available Scopes](https://developers.tiktok.com/doc/tiktok-api-scopes/) documentation.
    </Callout>

    Make sure to set the redirect URL to a valid HTTPS domain for local development. For production, you should set it to the URL of your application. If you change the base path of the auth routes, you should update the redirect URL accordingly.

    <Callout type="info">
      * The TikTok API does not provide email addresses. As a workaround, this implementation uses the user's `username` value for the `email` field, which is why it requires the `user.info.profile` scope instead of just `user.info.basic`.
      * For production use, you will need to request approval from TikTok for the scopes you intend to use.
    </Callout>
  </Step>

  <Step>
    ### Configure the provider

    To configure the provider, you need to import the provider and pass it to the `socialProviders` option of the auth instance.

    ```ts title="auth.ts"
    import { betterAuth } from "better-auth"

    export const auth = betterAuth({
        socialProviders: {
            tiktok: { // [!code highlight]
                clientSecret: process.env.TIKTOK_CLIENT_SECRET as string, // [!code highlight]
                clientKey: process.env.TIKTOK_CLIENT_KEY as string, // [!code highlight]
            }, // [!code highlight]
        },
    })
    ```
  </Step>

  <Step>
    ### Sign In with TikTok

    To sign in with TikTok, you can use the `signIn.social` function provided by the client. The `signIn` function takes an object with the following properties:

    * `provider`: The provider to use. It should be set to `tiktok`.

    ```ts title="auth-client.ts"
    import { createAuthClient } from "better-auth/client"
    const authClient =  createAuthClient()

    const signIn = async () => {
        const data = await authClient.signIn.social({
            provider: "tiktok"
        })
    }
    ```
  </Step>
</Steps>



# Google

Google provider setup and usage.



<Steps>
  <Step>
    ### Get your Google credentials

    To use Google as a social provider, you need to get your Google credentials. You can get them by creating a new project in the [Google Cloud Console](https://console.cloud.google.com/apis/dashboard).

    In the Google Cloud Console > Credentials > Authorized redirect URIs, make sure to set the redirect URL to `http://localhost:3000/api/auth/callback/google` for local development. For production, make sure to set the redirect URL as your application domain, e.g. `https://example.com/api/auth/callback/google`. If you change the base path of the auth routes, you should update the redirect URL accordingly.

    <Callout type="info">
      **Creating Your Google OAuth Credentials**

      If you haven't created OAuth credentials yet, follow these step-by-step instructions:

      1. Open **Google Cloud Console** → **APIs & Services** → **Credentials**
      2. Click **Create Credentials** → **OAuth client ID**
      3. Choose **Web application**
      4. Add your redirect URIs:
         * `http://localhost:3000/api/auth/callback/google` (for local development)
         * `https://your-domain.com/api/auth/callback/google` (for production)
      5. Copy the **Client ID** and **Client Secret** into your environment variables

      These steps avoid common issues such as `redirect_uri_mismatch`.
    </Callout>
  </Step>

  <Step>
    ### Configure the provider

    To configure the provider, you need to pass the `clientId` and `clientSecret` to `socialProviders.google` in your auth configuration.

    ```ts title="auth.ts"
    import { betterAuth } from "better-auth"

    export const auth = betterAuth({
        baseURL: process.env.BETTER_AUTH_URL, // [!code highlight]
        socialProviders: {
            google: { // [!code highlight]
                clientId: process.env.GOOGLE_CLIENT_ID as string, // [!code highlight]
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // [!code highlight]
            }, // [!code highlight]
        },
    })
    ```

    <Callout type="warn">
      **Important: Set Your Base URL**

      You must configure the `baseURL` to avoid `redirect_uri_mismatch` errors. Better Auth uses this to construct the OAuth callback URL sent to Google.

      **Option 1: Environment Variable (Recommended)**

      Add to your `.env` file:

      ```dotenv
      BETTER_AUTH_URL=https://your-domain.com
      ```

      **Option 2: Explicit Configuration**

      Pass `baseURL` directly in the auth config as shown above.
      Without this, the callback URL may default to `localhost`, causing Google OAuth to fail in production.
    </Callout>
  </Step>
</Steps>

## Usage

### Sign In with Google

To sign in with Google, you can use the `signIn.social` function provided by the client. The `signIn` function takes an object with the following properties:

* `provider`: The provider to use. It should be set to `google`.

```ts title="auth-client.ts"  /
import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient();

const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
};
```

### Sign In with Google With ID Token

To sign in with Google using the ID Token, you can use the `signIn.social` function to pass the ID Token.

This is useful when you have the ID Token from Google on the client-side and want to use it to sign in on the server.

<Callout>
  If ID token is provided no redirection will happen, and the user will be
  signed in directly.
</Callout>

```ts title="auth-client.ts"
const data = await authClient.signIn.social({
    provider: "google",
    idToken: {
        token: // Google ID Token,
        accessToken: // Google Access Token
    }
})
```

<Callout>
  If you want to use google one tap, you can use the [One Tap
  Plugin](/docs/plugins/one-tap) guide.
</Callout>

### Always ask to select an account

If you want to always ask the user to select an account, you pass the `prompt` parameter to the provider, setting it to `select_account`.

```ts
socialProviders: {
    google: {
        prompt: "select_account", // [!code highlight]
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
}
```

### Requesting Additional Google Scopes

If your application needs additional Google scopes after the user has already signed up (e.g., for Google Drive, Gmail, or other Google services), you can request them using the `linkSocial` method with the same Google provider.

```tsx title="auth-client.ts"
const requestGoogleDriveAccess = async () => {
  await authClient.linkSocial({
    provider: "google",
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
};

// Example usage in a React component
return (
  <button onClick={requestGoogleDriveAccess}>
    Add Google Drive Permissions
  </button>
);
```

This will trigger a new OAuth flow that requests the additional scopes. After completion, your account will have the new scope in the database, and the access token will give you access to the requested Google APIs.

<Callout>
  Ensure you're using Better Auth version 1.2.7 or later to avoid "Social
  account already linked" errors when requesting additional scopes from the same
  provider.
</Callout>

### Always get refresh token

Google only issues a refresh token the first time a user consents to your app.
If the user has already authorized your app, subsequent OAuth flows will only return an access token, not a refresh token.

To always get a refresh token, you can set the `accessType` to `offline`, and `prompt` to `select_account consent` in the provider options.

```ts
socialProviders: {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        accessType: "offline", // [!code highlight]
        prompt: "select_account consent", // [!code highlight]
    },
}
```

<Callout>
  **Revoking Access:** If you want to get a new refresh token for a user who has
  already authorized your app, you must have them revoke your app's access in
  their Google account settings, then re-authorize.
</Callout>


# Twitter (X)

Twitter provider setup and usage.



<Steps>
  <Step>
    ### Get your Twitter Credentials

    Get your Twitter credentials from the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard).

    Make sure to set the redirect URL to `http://localhost:3000/api/auth/callback/twitter` for local development. For production, you should set it to the URL of your application. If you change the base path of the auth routes, you should update the redirect URL accordingly.

    <Callout type="info">
      Twitter API v2 now supports email address retrieval. Make sure to request the `user.email` scope when configuring your Twitter app to enable this feature.
    </Callout>
  </Step>

  <Step>
    ### Configure the provider

    To configure the provider, you need to import the provider and pass it to the `socialProviders` option of the auth instance.

    ```ts title="auth.ts"  
    import { betterAuth } from "better-auth" 

    export const auth = betterAuth({
        socialProviders: {
            twitter: { // [!code highlight]
                clientId: process.env.TWITTER_CLIENT_ID as string, // [!code highlight]
                clientSecret: process.env.TWITTER_CLIENT_SECRET as string, // [!code highlight]
            }, // [!code highlight]
        },
    })
    ```
  </Step>

  <Step>
    ### Sign In with Twitter

    To sign in with Twitter, you can use the `signIn.social` function provided by the client. The `signIn` function takes an object with the following properties:

    * `provider`: The provider to use. It should be set to `twitter`.

    ```ts title="auth-client.ts"  
    import { createAuthClient } from "better-auth/client"
    const authClient =  createAuthClient()

    const signIn = async () => {
        const data = await authClient.signIn.social({
            provider: "twitter"
        })
    }
    ```
  </Step>
</Steps>


# Email & Password

Implementing email and password authentication with Better Auth.



Email and password authentication is a common method used by many applications. Better Auth provides a built-in email and password authenticator that you can easily integrate into your project.

<Callout type="info">
  If you prefer username-based authentication, check out the{" "}
  <Link href="/docs/plugins/username">username plugin</Link>. It extends the
  email and password authenticator with username support.
</Callout>

## Enable Email and Password

To enable email and password authentication, you need to set the `emailAndPassword.enabled` option to `true` in the `auth` configuration.

```ts title="auth.ts"
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: { // [!code highlight]
    enabled: true, // [!code highlight]
  }, // [!code highlight]
});
```

<Callout type="info">
  If it's not enabled, it'll not allow you to sign in or sign up with email and
  password.
</Callout>

## Usage

### Sign Up

To sign a user up, you can use the `signUp.email` function provided by the client.


### Client Side

```ts
const { data, error } = await authClient.signUp.email({
    name: John Doe,
    email: john.doe@example.com,
    password: password1234,
    image: https://example.com/image.png, // optional
    callbackURL: https://example.com/callback, // optional
});
```

### Server Side

```ts
const data = await auth.api.signUpEmail({
    body: {
        name: John Doe,
        email: john.doe@example.com,
        password: password1234,
        image: https://example.com/image.png, // optional
        callbackURL: https://example.com/callback, // optional
    }
});
```

### Type Definition

```ts
type signUpEmail = {
      /**
       * The name of the user.
       */
      name: string = "John Doe"
      /**
       * The email address of the user.
       */
      email: string = "john.doe@example.com"
      /**
       * The password of the user. It should be at least 8 characters long and max 128 by default.
       */
      password: string = "password1234"
      /**
       * An optional profile image of the user.
       */
      image?: string = "https://example.com/image.png"
      /**
       * An optional URL to redirect to after the user signs up.
       */
      callbackURL?: string = "https://example.com/callback"
  
}
```


<Callout>
  These are the default properties for the sign up email endpoint, however it's possible that with [additional fields](/docs/concepts/typescript#additional-fields) or special plugins you can pass more properties to the endpoint.
</Callout>

### Sign In

To sign a user in, you can use the `signIn.email` function provided by the client.


### Client Side

```ts
const { data, error } = await authClient.signIn.email({
    email: john.doe@example.com,
    password: password1234,
    rememberMe, // optional
    callbackURL: https://example.com/callback, // optional
});
```

### Server Side

```ts
const data = await auth.api.signInEmail({
    body: {
        email: john.doe@example.com,
        password: password1234,
        rememberMe, // optional
        callbackURL: https://example.com/callback, // optional
    },
    // This endpoint requires session cookies.
    headers: await headers()
});
```

### Type Definition

```ts
type signInEmail = {
      /**
       * The email address of the user.
       */
      email: string = "john.doe@example.com"
      /**
       * The password of the user. It should be at least 8 characters long and max 128 by default.
       */
      password: string = "password1234"
      /**
       * If false, the user will be signed out when the browser is closed. (optional) (default: true)
       */
      rememberMe?: boolean = true
      /**
       * An optional URL to redirect to after the user signs in. (optional)
       */
      callbackURL?: string = "https://example.com/callback"
  
}
```


<Callout>
  These are the default properties for the sign in email endpoint, however it's possible that with [additional fields](/docs/concepts/typescript#additional-fields) or special plugins you can pass different properties to the endpoint.
</Callout>

### Sign Out

To sign a user out, you can use the `signOut` function provided by the client.


### Client Side

```ts
const { data, error } = await authClient.signOut({});
```

### Server Side

```ts
await auth.api.signOut({

    // This endpoint requires session cookies.
    headers: await headers()
});
```

### Type Definition

```ts
type signOut = {
  
}
```


you can pass `fetchOptions` to redirect onSuccess

```ts title="auth-client.ts" 
await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/login"); // redirect to login page
    },
  },
});
```

### Email Verification

To enable email verification, you need to pass a function that sends a verification email with a link. The `sendVerificationEmail` function takes a data object with the following properties:

* `user`: The user object.
* `url`: The URL to send to the user which contains the token.
* `token`: A verification token used to complete the email verification.

and a `request` object as the second parameter.

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { sendEmail } from "./email"; // your email sending function

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
});
```

<Callout type="warn">
  Avoid awaiting the email sending to prevent
  timing attacks. On serverless platforms, use `waitUntil` or similar to ensure the email is sent.
</Callout>

On the client side you can use `sendVerificationEmail` function to send verification link to user. This will trigger the `sendVerificationEmail` function you provided in the `auth` configuration.

Once the user clicks on the link in the email, if the token is valid, the user will be redirected to the URL provided in the `callbackURL` parameter. If the token is invalid, the user will be redirected to the URL provided in the `callbackURL` parameter with an error message in the query string `?error=invalid_token`.

#### Require Email Verification

If you enable require email verification, users must verify their email before they can log in. And every time a user tries to sign in, sendVerificationEmail is called.

<Callout>
  This only works if you have sendVerificationEmail implemented and if the user
  is trying to sign in with email and password.
</Callout>

```ts title="auth.ts"
export const auth = betterAuth({
  emailAndPassword: {
    requireEmailVerification: true,
  },
});
```

If a user tries to sign in without verifying their email, you can handle the error and show a message to the user.

```ts title="auth-client.ts"
await authClient.signIn.email(
  {
    email: "email@example.com",
    password: "password",
  },
  {
    onError: (ctx) => {
      // Handle the error
      if (ctx.error.status === 403) {
        alert("Please verify your email address");
      }
      //you can also show the original error message
      alert(ctx.error.message);
    },
  }
);
```

#### Triggering manually Email Verification

You can trigger the email verification manually by calling the `sendVerificationEmail` function.

```ts
await authClient.sendVerificationEmail({
  email: "user@email.com",
  callbackURL: "/", // The redirect URL after verification
});
```

### Request Password Reset

To allow users to reset a password first you need to provide `sendResetPassword` function to the email and password authenticator. The `sendResetPassword` function takes a data object with the following properties:

* `user`: The user object.
* `url`: The URL to send to the user which contains the token.
* `token`: A verification token used to complete the password reset.

and a `request` object as the second parameter.

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { sendEmail } from "./email"; // your email sending function

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({user, url, token}, request) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }, request) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
});
```

<Callout type="warn">
  Avoid awaiting the email sending to prevent
  timing attacks. On serverless platforms, use `waitUntil` or similar to ensure the email is sent.
</Callout>

Additionally, you can provide an `onPasswordReset` callback to execute logic after a password has been successfully reset.

Once you configured your server you can call `requestPasswordReset` function to send reset password link to user. If the user exists, it will trigger the `sendResetPassword` function you provided in the auth config.


### Client Side

```ts
const { data, error } = await authClient.requestPasswordReset({
    email: john.doe@example.com,
    redirectTo: https://example.com/reset-password, // optional
});
```

### Server Side

```ts
const data = await auth.api.requestPasswordReset({
    body: {
        email: john.doe@example.com,
        redirectTo: https://example.com/reset-password, // optional
    }
});
```

### Type Definition

```ts
type requestPasswordReset = {
      /**
       * The email address of the user to send a password reset email to 
       */
      email: string = "john.doe@example.com"
      /**
       * The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter `?error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?token=VALID_TOKEN 
       */
      redirectTo?: string = "https://example.com/reset-password"
  
}
```


When a user clicks on the link in the email, they will be redirected to the reset password page. You can add the reset password page to your app. Then you can use `resetPassword` function to reset the password. It takes an object with the following properties:

* `newPassword`: The new password of the user.

```ts title="auth-client.ts"
const { data, error } = await authClient.resetPassword({
  newPassword: "password1234",
  token,
});
```


### Client Side

```ts
const { data, error } = await authClient.resetPassword({
    newPassword: password1234,
    token,
});
```

### Server Side

```ts
const data = await auth.api.resetPassword({
    body: {
        newPassword: password1234,
        token,
    }
});
```

### Type Definition

```ts
type resetPassword = {
      /**
       * The new password to set 
       */
      newPassword: string = "password1234"
      /**
       * The token to reset the password 
       */
      token: string
  
}
```


### Update password

A user's password isn't stored in the user table. Instead, it's stored in the account table. To change the password of a user, you can use one of the following approaches:


### Client Side

```ts
const { data, error } = await authClient.changePassword({
    newPassword: newpassword1234,
    currentPassword: oldpassword1234,
    revokeOtherSessions, // optional
});
```

### Server Side

```ts
const data = await auth.api.changePassword({
    body: {
        newPassword: newpassword1234,
        currentPassword: oldpassword1234,
        revokeOtherSessions, // optional
    },
    // This endpoint requires session cookies.
    headers: await headers()
});
```

### Type Definition

```ts
type changePassword = {
      /**
       * The new password to set 
       */
      newPassword: string = "newpassword1234"
      /**
       * The current user password 
       */
      currentPassword: string = "oldpassword1234"
      /**
       * When set to true, all other active sessions for this user will be invalidated
       */
      revokeOtherSessions?: boolean = true
  
}
```


### Configuration

**Password**

Better Auth stores passwords inside the `account` table with `providerId` set to `credential`.

**Password Hashing**: Better Auth uses `scrypt` to hash passwords. The `scrypt` algorithm is designed to be slow and memory-intensive to make it difficult for attackers to brute force passwords. OWASP recommends using `scrypt` if `argon2id` is not available. We decided to use `scrypt` because it's natively supported by Node.js.

You can pass custom password hashing algorithm by setting `password` option in the `emailAndPassword` configuration.

**Example**

Here's an example of customizing the password hashing to use Argon2:

```ts title="password.ts"
import { hash, type Options, verify } from "@node-rs/argon2";

const opts: Options = {
  memoryCost: 65536, // 64 MiB
  timeCost: 3, // 3 iterations
  parallelism: 4, // 4 lanes
  outputLen: 32, // 32 bytes
  algorithm: 2, // Argon2id
};

export async function hashPassword(password: string) {
  const result = await hash(password, opts);
  return result;
}

export async function verifyPassword(data: { password: string; hash: string }) {
  const { password, hash } = data;
  const result = await verify(hash, password, opts);
  return result;
}
```

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { hashPassword, verifyPassword } from "./password";

export const auth = betterAuth({
  emailAndPassword: {
    //...rest of the options
    enabled: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
});
```

<TypeTable
  type={{
  enabled: {
    description: "Enable email and password authentication.",
    type: "boolean",
    default: "false",
  },
  disableSignUp: {
    description: "Disable email and password sign up.",
    type: "boolean",
    default: "false"
  },
  minPasswordLength: {
    description: "The minimum length of a password.",
    type: "number",
    default: 8,
  },
  maxPasswordLength: {
    description: "The maximum length of a password.",
    type: "number",
    default: 128,
  },
  sendResetPassword: {
    description:
      "Sends a password reset email. It takes a function that takes two parameters: token and user.",
    type: "function",
  },
  onPasswordReset: {
    description:
      "A callback function that is triggered when a user's password is changed successfully.",
    type: "function",
  },
  resetPasswordTokenExpiresIn: {
    description:
      "Number of seconds the reset password token is valid for.",
    type: "number",
    default: 3600
  },
  password: {
    description: "Password configuration.",
    type: "object",
    properties: {
      hash: {
        description: "custom password hashing function",
        type: "function",
      },
      verify: {
        description: "custom password verification function",
        type: "function",
      },
    },
  },
}}
/>



# Email OTP

Email OTP plugin for Better Auth.



The Email OTP plugin allows user to sign in, verify their email, or reset their password using a one-time password (OTP) sent to their email address.

## Installation

<Steps>
  <Step>
    ### Add the plugin to your auth config

    Add the `emailOTP` plugin to your auth config and implement the `sendVerificationOTP()` method.

    ```ts title="auth.ts"
    import { betterAuth } from "better-auth"
    import { emailOTP } from "better-auth/plugins" // [!code highlight]

    export const auth = betterAuth({
        // ... other config options
        plugins: [
            emailOTP({ // [!code highlight]
                async sendVerificationOTP({ email, otp, type }) { // [!code highlight]
                    if (type === "sign-in") { // [!code highlight]
                        // Send the OTP for sign in // [!code highlight]
                    } else if (type === "email-verification") { // [!code highlight]
                        // Send the OTP for email verification // [!code highlight]
                    } else { // [!code highlight]
                        // Send the OTP for password reset // [!code highlight]
                    } // [!code highlight]
                }, // [!code highlight]
            }) // [!code highlight]
        ]
    })
    ```
  </Step>

  <Step>
    ### Add the client plugin

    ```ts title="auth-client.ts"
    import { createAuthClient } from "better-auth/client"
    import { emailOTPClient } from "better-auth/client/plugins"

    export const authClient = createAuthClient({
        plugins: [
            emailOTPClient()
        ]
    })
    ```
  </Step>
</Steps>

## Usage

### Send an OTP

Use the `sendVerificationOtp()` method to send an OTP to the user's email address.


### Client Side

```ts
const { data, error } = await authClient.emailOtp.sendVerificationOtp({
    email: user@example.com,
    type: sign-in,
});
```

### Server Side

```ts
const data = await auth.api.sendVerificationOTP({
    body: {
        email: user@example.com,
        type: sign-in,
    }
});
```

### Type Definition

```ts
type sendVerificationOTP = {
      /**
       * Email address to send the OTP. 
       */
      email: string = "user@example.com"
      /**
       * Type of the OTP. `sign-in`, `email-verification`, or `forget-password`. 
       */
      type: "email-verification" | "sign-in" | "forget-password" = "sign-in"
  
}
```


### Check an OTP (optional)

Use the `checkVerificationOtp()` method to check if an OTP is valid.


### Client Side

```ts
const { data, error } = await authClient.emailOtp.checkVerificationOtp({
    email: user@example.com,
    type: sign-in,
    otp: 123456,
});
```

### Server Side

```ts
const data = await auth.api.checkVerificationOTP({
    body: {
        email: user@example.com,
        type: sign-in,
        otp: 123456,
    }
});
```

### Type Definition

```ts
type checkVerificationOTP = {
      /**
       * Email address to send the OTP. 
       */
      email: string = "user@example.com"
      /**
       * Type of the OTP. `sign-in`, `email-verification`, or `forget-password`. 
       */
      type: "email-verification" | "sign-in" | "forget-password" = "sign-in"
      /**
       * OTP sent to the email. 
       */
      otp: string = "123456"
  
}
```


### Sign In with OTP

To sign in with OTP, use the `sendVerificationOtp()` method to send a "sign-in" OTP to the user's email address.


### Client Side

```ts
const { data, error } = await authClient.emailOtp.sendVerificationOtp({
    email: user@example.com,
    type: sign-in,
});
```

### Server Side

```ts
const data = await auth.api.sendVerificationOTP({
    body: {
        email: user@example.com,
        type: sign-in,
    }
});
```

### Type Definition

```ts
type sendVerificationOTP = {
      /**
       * Email address to send the OTP. 
       */
      email: string = "user@example.com"
      /**
       * Type of the OTP.
       */
      type: "sign-in" = "sign-in"
  
}
```


Once the user provides the OTP, you can sign in the user using the `signIn.emailOtp()` method.


### Client Side

```ts
const { data, error } = await authClient.signIn.emailOtp({
    email: user@example.com,
    otp: 123456,
});
```

### Server Side

```ts
const data = await auth.api.signInEmailOTP({
    body: {
        email: user@example.com,
        otp: 123456,
    }
});
```

### Type Definition

```ts
type signInEmailOTP = {
      /**
       * Email address to sign in. 
       */
      email: string = "user@example.com"
      /**
       * OTP sent to the email. 
       */
      otp: string = "123456"
  
}
```


<Callout>
  If the user is not registered, they'll be automatically registered. If you want to prevent this, you can pass `disableSignUp` as `true` in the [options](#options).
</Callout>

### Verify Email with OTP

To verify the user's email address with OTP, use the `sendVerificationOtp()` method to send an "email-verification" OTP to the user's email address.


### Client Side

```ts
const { data, error } = await authClient.emailOtp.sendVerificationOtp({
    email: user@example.com,
    type: email-verification,
});
```

### Server Side

```ts
const data = await auth.api.sendVerificationOTP({
    body: {
        email: user@example.com,
        type: email-verification,
    }
});
```

### Type Definition

```ts
type sendVerificationOTP = {
      /**
       * Email address to send the OTP. 
       */
      email: string = "user@example.com"
      /**
       * Type of the OTP.
       */
      type: "email-verification" = "email-verification"
  
}
```


Once the user provides the OTP, use the `verifyEmail()` method to complete email verification.


### Client Side

```ts
const { data, error } = await authClient.emailOtp.verifyEmail({
    email: user@example.com,
    otp: 123456,
});
```

### Server Side

```ts
const data = await auth.api.verifyEmailOTP({
    body: {
        email: user@example.com,
        otp: 123456,
    }
});
```

### Type Definition

```ts
type verifyEmailOTP = {
      /**
       * Email address to verify. 
       */
      email: string = "user@example.com"
      /**
       * OTP to verify. 
       */
      otp: string = "123456"
  
}
```


### Reset Password with OTP

To reset the user's password with OTP, use the `emailOtp.requestPasswordReset()` method to send a "forget-password" OTP to the user's email address.


### Client Side

```ts
const { data, error } = await authClient.emailOtp.requestPasswordReset({
    email: user@example.com,
});
```

### Server Side

```ts
const data = await auth.api.requestPasswordResetEmailOTP({
    body: {
        email: user@example.com,
    }
});
```

### Type Definition

```ts
type requestPasswordResetEmailOTP = {
      /**
       * Email address to send the OTP.
       */
      email: string = "user@example.com"
  
}
```


<Callout type="warn">
  The `/forget-password/email-otp` endpoint is deprecated. Please use `/email-otp/request-password-reset` instead.
</Callout>

Once the user provides the OTP, use the `checkVerificationOtp()` method to check if it's valid (optional).


### Client Side

```ts
const { data, error } = await authClient.emailOtp.checkVerificationOtp({
    email: user@example.com,
    type: forget-password,
    otp: 123456,
});
```

### Server Side

```ts
const data = await auth.api.checkVerificationOTP({
    body: {
        email: user@example.com,
        type: forget-password,
        otp: 123456,
    }
});
```

### Type Definition

```ts
type checkVerificationOTP = {
      /**
       * Email address to send the OTP. 
       */
      email: string = "user@example.com"
      /**
       * Type of the OTP.
       */
      type: "forget-password" = "forget-password"
      /**
       * OTP sent to the email. 
       */
      otp: string = "123456"
  
}
```


Then, use the `resetPassword()` method to reset the user's password.


### Client Side

```ts
const { data, error } = await authClient.emailOtp.resetPassword({
    email: user@example.com,
    otp: 123456,
    password: new-secure-password,
});
```

### Server Side

```ts
const data = await auth.api.resetPasswordEmailOTP({
    body: {
        email: user@example.com,
        otp: 123456,
        password: new-secure-password,
    }
});
```

### Type Definition

```ts
type resetPasswordEmailOTP = {
      /**
       * Email address to reset the password. 
       */
      email: string = "user@example.com"
      /**
       * OTP sent to the email. 
       */
      otp: string = "123456"
      /**
       * New password. 
       */
      password: string = "new-secure-password"
  
}
```


### Override Default Email Verification

To override the default email verification, pass `overrideDefaultEmailVerification: true` in the options. This will make the system use an email OTP instead of the default verification link whenever email verification is triggered. In other words, the user will verify their email using an OTP rather than clicking a link.

```ts title="auth.ts"
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true, // [!code highlight]
      async sendVerificationOTP({ email, otp, type }) {
        // Implement the sendVerificationOTP method to send the OTP to the user's email address
      },
    }),
  ],
});
```

## Options

* `sendVerificationOTP`: A function that sends the OTP to the user's email address. The function receives an object with the following properties:

  * `email`: The user's email address.
  * `otp`: The OTP to send.
  * `type`: The type of OTP to send. Can be "sign-in", "email-verification", or "forget-password".

  <Callout type="warn">
    It is recommended to not await the email sending to avoid timing attacks. On serverless platforms, use `waitUntil` or similar to ensure the email is sent.
  </Callout>

* `otpLength`: The length of the OTP. Defaults to `6`.

* `expiresIn`: The expiry time of the OTP in seconds. Defaults to `300` seconds.

```ts title="auth.ts"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
    plugins: [
        emailOTP({
            otpLength: 8,
            expiresIn: 600
        })
    ]
})
```

* `sendVerificationOnSignUp`: A boolean value that determines whether to send the OTP when a user signs up. Defaults to `false`.

* `disableSignUp`: A boolean value that determines whether to prevent automatic sign-up when the user is not registered. Defaults to `false`.

* `generateOTP`: A function that generates the OTP. Defaults to a random 6-digit number.

* `allowedAttempts`: The maximum number of attempts allowed for verifying an OTP. Defaults to `3`. After exceeding this limit, the OTP becomes invalid and the user needs to request a new one.

```ts title="auth.ts"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
    plugins: [
        emailOTP({
            allowedAttempts: 5, // Allow 5 attempts before invalidating the OTP
            expiresIn: 300
        })
    ]
})
```

When the maximum attempts are exceeded, the `verifyOTP`, `signIn.emailOtp`, `verifyEmail`, and `resetPassword` methods will return an error with code `TOO_MANY_ATTEMPTS`.

* `storeOTP`: The method to store the OTP in your database, whether `encrypted`, `hashed` or `plain` text. Default is `plain` text.

<Callout>
  Note: This will not affect the OTP sent to the user, it will only affect the OTP stored in your database.
</Callout>

Alternatively, you can pass a custom encryptor or hasher to store the OTP in your database.

**Custom encryptor**

```ts title="auth.ts"
emailOTP({
    storeOTP: { 
        encrypt: async (otp) => {
            return myCustomEncryptor(otp);
        },
        decrypt: async (otp) => {
            return myCustomDecryptor(otp);
        },
    }
})
```

**Custom hasher**

```ts title="auth.ts"
emailOTP({
    storeOTP: {
        hash: async (otp) => {
            return myCustomHasher(otp);
        },
    }
})
```

