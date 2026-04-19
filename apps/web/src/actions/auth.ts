'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function loginAdmin(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  // Determine redirect based on role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication failed' }

  // Check if superadmin
  const { data: superadmin } = await supabase
    .from('superadmins' as never)
    .select('id')
    .eq('id', user.id)
    .single()

  if (superadmin) {
    revalidatePath('/', 'layout')
    redirect('/superadmin/dashboard')
  }

  // Check business_users role
  const { data: businessUser } = await supabase
    .from('business_users' as never)
    .select('role')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!businessUser) {
    await supabase.auth.signOut()
    return { error: 'No business account found. Contact your administrator.' }
  }

  revalidatePath('/', 'layout')

  if ((businessUser as { role: string }).role === 'admin') {
    redirect('/admin/dashboard')
  } else {
    redirect('/staff/dashboard')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}
