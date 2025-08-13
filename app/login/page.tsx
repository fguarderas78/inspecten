"use client"
import { signIn, signOut, useSession } from "next-auth/react"

export default function LoginPage() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div style={{ padding: 24 }}>
        <p>Sesión iniciada: {session.user?.email}</p>
        <button onClick={() => signOut()}>Cerrar sesión</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Acceder</h1>
      <button onClick={() => signIn("google")}>
        Continuar con Google
      </button>
    </div>
  )
}
