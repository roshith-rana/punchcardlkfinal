import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@punchcard/supabase', '@punchcard/types', '@punchcard/utils'],
}

export default nextConfig
