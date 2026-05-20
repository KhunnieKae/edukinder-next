import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ถ้าไม่ได้ login และไม่ได้อยู่หน้า login → redirect ไป login
  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ถ้า login แล้วและอยู่หน้า login → redirect ไป dashboard
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
export type UserRole = 'admin' | 'teacher'

export type ReportStatus =
  | 'draft' | 'submitted' | 'pending_review'
  | 'approved' | 'rejected' | 'overdue'

export type ActivityKey =
  | 'movement' | 'experience' | 'art'
  | 'corner' | 'outdoor' | 'game'

export interface Profile {
  id: string
  email: string
  name: string
  role: UserRole
  classroom?: string
  avatar_url?: string
  avatar_color?: string
  exp: number
  streak: number
  last_submit?: string
  created_at: string
}

export interface LessonReport {
  id: string
  teacher_id: string
  classroom_name: string
  unit: string
  report_date: string
  status: ReportStatus
  total_students: number
  exp_earned: number
  submitted_at?: string
  approved_at?: string
  created_at: string
  // Relations
  profiles?: Profile
  lesson_activities?: LessonActivity[]
  report_images?: ReportImage[]
}

export interface LessonActivity {
  id: string
  report_id: string
  activity_key: ActivityKey
  activity_label: string
  objective?: string
  result?: string
  passed_count: number
  failed_count: number
  passed_names?: string
  failed_names?: string
  problem?: string
  solution?: string
}

export interface ReportImage {
  id: string
  report_id: string
  storage_path: string
  url: string
  file_name?: string
  slot_index: number
}