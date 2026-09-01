# FaceTrack AI

AI-Powered Student Attendance Management System with real-time facial recognition.

## Features

- 🎯 Real-time face recognition using face-api.js
- 🔒 Anti-spoofing and liveness detection
- 📊 Beautiful analytics dashboard
- 📱 Fully responsive design
- 🌓 Dark mode support
- 📄 Export reports (PDF, Excel, CSV)
- 👥 Multi-role support (Admin, Teacher, Student)

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Supabase (Database + Auth + Storage)
- face-api.js + TensorFlow.js
- Framer Motion
- Recharts

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

3. Run the SQL schema in Supabase:
```bash
supabase/schema.sql
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

Deploy to Vercel:
```bash
vercel --prod
```

## License

MIT
