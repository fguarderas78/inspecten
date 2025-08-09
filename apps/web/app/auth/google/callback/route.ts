@"
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/', request.url))
}

export async function POST(request: NextRequest) {
  return NextResponse.redirect(new URL('/', request.url))
}
"@ | Out-File -FilePath "apps\web\app\auth\google\callback\route.ts" -Encoding UTF8