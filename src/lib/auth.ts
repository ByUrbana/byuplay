import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Tentativa de autorização:", { 
          email: credentials?.email,
          hasPassword: !!credentials?.password,
          adminEmail: process.env.ADMIN_EMAIL,
          hasAdminPassword: !!process.env.ADMIN_PASSWORD
        });
        
        // Verificar se é admin
        if (credentials?.email === process.env.ADMIN_EMAIL && 
            credentials?.password === process.env.ADMIN_PASSWORD) {
          console.log("Login admin bem-sucedido");
          return {
            id: "admin",
            email: credentials.email,
            name: "Admin",
            role: "admin"
          }
        }
        
        console.log("Credenciais inválidas");
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "user"
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
