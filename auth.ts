import NextAuth, { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getServerSession } from 'next-auth';
import { ensureSuperadmin, getUserByEmail } from '@/lib/users';
import { verifyPassword } from '@/lib/password';
import { normalizeRole } from '@/lib/rbac';
import { isAuthenticatedRoutesDisabled } from '@/lib/authenticated-routes';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (isAuthenticatedRoutesDisabled()) return null;
        await ensureSuperadmin();
        const email = String(credentials?.email || '').trim().toLowerCase();
        const password = String(credentials?.password || '');
        if (!email || !password) return null;
        const user = await getUserByEmail(email);
        if (!user || !user.isActive) return null;
        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: normalizeRole(user.role),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if ((user as { role?: string })?.role) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id || '');
        session.user.role = normalizeRole(String(token.role || 'staff'));
      }
      return session;
    },
  },
};

export const auth = () => getServerSession(authOptions);
const handler = NextAuth(authOptions);
export { handler };
