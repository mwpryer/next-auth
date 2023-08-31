import type { Metadata } from "next"
import AuthContext from "@/context/auth-context"

export const metadata: Metadata = {
  title: "next-auth",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthContext>{children}</AuthContext>
      </body>
    </html>
  )
}
