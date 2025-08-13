import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",  // fuerza selector de cuentas
          hd: "inspecten.com",       // sugiere dominio corporativo
        },
      },
    }),
  ],
  // (Opcional) valida dominio y rechaza si no es @inspecten.com
  callbacks: {
    async signIn({ profile }) {
      const email = (profile?.email || "").toLowerCase()
      return email.endsWith("@inspecten.com")
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
