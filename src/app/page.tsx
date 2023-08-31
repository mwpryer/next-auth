"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { signIn, signOut } from "next-auth/react"
import axios from "axios"

export default function Home() {
  const [authFlow, setAuthFlow] = useState<"signup" | "signin">("signup")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const session = useSession()

  const handleSignInCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      if (authFlow === "signup") await axios.post("/api/register", { email, password })
      const res = await signIn("credentials", { email, password, redirect: false })
      if (res?.error) throw new Error(res.error)
      setEmail("")
      setPassword("")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message)
      } else if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInProvider = async (provider: string) => {
    setIsLoading(true)
    setError("")
    await signIn(provider)
    setIsLoading(false)
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    setError("")
    await signOut({ redirect: false })
    setIsLoading(false)
  }

  return (
    <main>
      <button onClick={() => handleSignInProvider("google")}>Google</button>
      <button onClick={() => handleSignInProvider("github")}>GitHub</button>
      <button onClick={() => handleSignInProvider("discord")}>Discord</button>
      <form onSubmit={handleSignInCredentials}>
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: "block" }} />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: "block" }} />
        <button type="submit">{authFlow === "signup" ? "Sign up" : "Sign in"}</button>
      </form>
      <p onClick={() => setAuthFlow((prev) => (prev === "signup" ? "signin" : "signup"))} style={{ textDecoration: "underline", cursor: "pointer" }}>
        {authFlow === "signup" ? "Sign in" : "Sign up"}
      </p>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <pre>{JSON.stringify(session, null, 2)}</pre>
      {session.status === "authenticated" && <button onClick={handleSignOut}>Sign out</button>}
    </main>
  )
}
