import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Verificar se é admin
        if (req.nextUrl.pathname.startsWith("/dashboard") || 
            req.nextUrl.pathname.startsWith("/upload-video")) {
          return token?.role === "admin"
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/upload-video/:path*", "/gerenciar-videos/:path*", "/api/videos/:path*", "/api/videos-simple", "/api/test-cloudinary", "/api/debug-cloudinary"]
}
