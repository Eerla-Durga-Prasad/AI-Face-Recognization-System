-- ============================================================
-- AI FACE RECOGNITION ATTENDANCE SYSTEM
-- SUPABASE - CLEAN & FRESH INSTALLATION
-- ============================================================

BEGIN;

-- ============================================================
-- 1. CLEAN OLD DATABASE OBJECTS
-- ============================================================

DROP TABLE IF EXISTS public.attendance_logs CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.face_samples CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP FUNCTION IF EXISTS public.create_attendance_log() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

DROP TYPE IF EXISTS public.attendance_status CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;


-- ============================================================
-- 2. EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- 3. ENUM TYPES
-- ============================================================

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'teacher',
    'student'
);

CREATE TYPE public.attendance_status AS ENUM (
    'present',
    'absent',
    'late',
    'excused'
);


-- ============================================================
-- 4. PROFILES TABLE
-- MUST BE CREATED BEFORE is_admin()
-- ============================================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    full_name TEXT NOT NULL DEFAULT 'Unknown User',

    email TEXT NOT NULL DEFAULT '',

    role public.user_role NOT NULL DEFAULT 'student',

    avatar_url TEXT,

    phone TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 5. ADMIN HELPER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'admin'::public.user_role
    );
$$;


-- ============================================================
-- 6. PROFILE POLICIES
-- ============================================================

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    auth.uid() = id
);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
    auth.uid() = id
)
WITH CHECK (
    auth.uid() = id
);

CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (
    public.is_admin()
)
WITH CHECK (
    public.is_admin()
);


-- ============================================================
-- 7. DEPARTMENTS
-- ============================================================

CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    code TEXT NOT NULL UNIQUE,

    head_of_department TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view departments"
ON public.departments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage departments"
ON public.departments
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ============================================================
-- 8. SUBJECTS
-- ============================================================

CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    code TEXT NOT NULL UNIQUE,

    department_id UUID
        REFERENCES public.departments(id)
        ON DELETE CASCADE,

    credits INTEGER NOT NULL DEFAULT 3
        CHECK (credits > 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view subjects"
ON public.subjects
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins and teachers can manage subjects"
ON public.subjects
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role IN (
              'admin'::public.user_role,
              'teacher'::public.user_role
          )
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role IN (
              'admin'::public.user_role,
              'teacher'::public.user_role
          )
    )
);


-- ============================================================
-- 9. CLASSES
-- ============================================================

CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    section TEXT NOT NULL,

    year INTEGER NOT NULL
        CHECK (year BETWEEN 1 AND 4),

    semester INTEGER NOT NULL
        CHECK (semester BETWEEN 1 AND 8),

    department_id UUID
        REFERENCES public.departments(id)
        ON DELETE CASCADE,

    teacher_id UUID
        REFERENCES public.profiles(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view classes"
ON public.classes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage classes"
ON public.classes
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ============================================================
-- 10. STUDENTS
-- ============================================================

CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID UNIQUE
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    roll_number TEXT NOT NULL UNIQUE,

    department_id UUID
        REFERENCES public.departments(id)
        ON DELETE CASCADE,

    class_id UUID
        REFERENCES public.classes(id)
        ON DELETE CASCADE,

    year INTEGER NOT NULL
        CHECK (year BETWEEN 1 AND 4),

    semester INTEGER NOT NULL
        CHECK (semester BETWEEN 1 AND 8),

    section TEXT NOT NULL,

    face_registered BOOLEAN NOT NULL DEFAULT FALSE,

    face_embedding BYTEA,

    face_embedding_updated_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can view own student record"
ON public.students
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
);

CREATE POLICY "Admins and teachers can view students"
ON public.students
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role IN (
              'admin'::public.user_role,
              'teacher'::public.user_role
          )
    )
);

CREATE POLICY "Admins and teachers can manage students"
ON public.students
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role IN (
              'admin'::public.user_role,
              'teacher'::public.user_role
          )
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role IN (
              'admin'::public.user_role,
              'teacher'::public.user_role
          )
    )
);


-- ============================================================
-- 11. FACE SAMPLES
-- ============================================================

CREATE TABLE public.face_samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES public.students(id)
        ON DELETE CASCADE,

    embedding BYTEA NOT NULL,

    quality_score REAL NOT NULL DEFAULT 0
        CHECK (quality_score >= 0),

    is_blurry BOOLEAN NOT NULL DEFAULT FALSE,

    is_multi_face BOOLEAN NOT NULL DEFAULT FALSE,

    is_no_face BOOLEAN NOT NULL DEFAULT FALSE,

    device_info TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.face_samples ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Admins and teachers can view face samples"
ON public.face_samples
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role IN (
              'admin'::public.user_role,
              'teacher'::public.user_role
          )
    )
);

CREATE POLICY "Admins and teachers can manage face samples"
ON public.face_samples
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role IN (
              'admin'::public.user_role,
              'teacher'::public.user_role
          )
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role IN (
              'admin'::public.user_role,
              'teacher'::public.user_role
          )
    )
);


-- ============================================================
-- 12. ATTENDANCE
-- ============================================================

CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES public.students(id)
        ON DELETE CASCADE,

    subject_id UUID NOT NULL
        REFERENCES public.subjects(id)
        ON DELETE CASCADE,

    teacher_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    class_id UUID NOT NULL
        REFERENCES public.classes(id)
        ON DELETE CASCADE,

    date DATE NOT NULL,

    time TIME NOT NULL,

    status public.attendance_status NOT NULL DEFAULT 'present',

    confidence_score REAL
        CHECK (
            confidence_score IS NULL
            OR confidence_score >= 0
        ),

    marked_by UUID
        REFERENCES public.profiles(id)
        ON DELETE SET NULL,

    device_info TEXT,

    browser_info TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(student_id, subject_id, date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Authenticated users can view attendance"
ON public.attendance
FOR SELECT
TO authenticated
USING (
    auth.uid() = teacher_id
    OR auth.uid() = marked_by
    OR public.is_admin()
    OR EXISTS (
        SELECT 1
        FROM public.students s
        WHERE s.id = attendance.student_id
          AND s.user_id = auth.uid()
    )
);


CREATE POLICY "Teachers and admins can mark attendance"
ON public.attendance
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role IN (
              'admin'::public.user_role,
              'teacher'::public.user_role
          )
    )
);


CREATE POLICY "Admins can update attendance"
ON public.attendance
FOR UPDATE
TO authenticated
USING (
    public.is_admin()
)
WITH CHECK (
    public.is_admin()
);


CREATE POLICY "Admins can delete attendance"
ON public.attendance
FOR DELETE
TO authenticated
USING (
    public.is_admin()
);


-- ============================================================
-- 13. ATTENDANCE LOGS
-- ============================================================

CREATE TABLE public.attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES public.students(id)
        ON DELETE CASCADE,

    date DATE NOT NULL,

    time TIME NOT NULL,

    status public.attendance_status NOT NULL,

    confidence_score REAL,

    device_info TEXT,

    browser_info TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Admins and teachers can view attendance logs"
ON public.attendance_logs
FOR SELECT
TO authenticated
USING (
    public.is_admin()
    OR EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role = 'teacher'::public.user_role
    )
);


-- ============================================================
-- 14. NOTIFICATIONS
-- ============================================================

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,

    message TEXT NOT NULL,

    type TEXT NOT NULL
        CHECK (
            type IN (
                'info',
                'success',
                'warning',
                'error'
            )
        ),

    read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);


CREATE POLICY "Users can create own notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);


CREATE POLICY "Users can update own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);


CREATE POLICY "Admins can manage notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (
    public.is_admin()
)
WITH CHECK (
    public.is_admin()
);


-- ============================================================
-- 15. SETTINGS
-- ============================================================

CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    key TEXT NOT NULL UNIQUE,

    value JSONB,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Authenticated users can view settings"
ON public.settings
FOR SELECT
TO authenticated
USING (true);


CREATE POLICY "Admins can manage settings"
ON public.settings
FOR ALL
TO authenticated
USING (
    public.is_admin()
)
WITH CHECK (
    public.is_admin()
);


-- ============================================================
-- 16. UPDATED_AT FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


-- ============================================================
-- 17. UPDATED_AT TRIGGERS
-- ============================================================

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================
-- 18. HANDLE NEW AUTH USER
-- SECURITY:
-- New users ALWAYS start as STUDENT.
-- Admin/teacher roles must be assigned by an admin.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        role
    )
    VALUES (
        NEW.id,

        COALESCE(
            NULLIF(
                TRIM(
                    NEW.raw_user_meta_data ->> 'full_name'
                ),
                ''
            ),
            'Unknown User'
        ),

        COALESCE(
            NEW.email,
            ''
        ),

        'student'::public.user_role
    )
    ON CONFLICT (id)
    DO UPDATE SET
        email = EXCLUDED.email;

    RETURN NEW;
END;
$$;


-- ============================================================
-- 19. AUTH USER TRIGGER
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created
ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 20. ATTENDANCE LOG FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_attendance_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

    INSERT INTO public.attendance_logs (
        student_id,
        date,
        time,
        status,
        confidence_score,
        device_info,
        browser_info
    )
    VALUES (
        NEW.student_id,
        NEW.date,
        NEW.time,
        NEW.status,
        NEW.confidence_score,
        NEW.device_info,
        NEW.browser_info
    );

    RETURN NEW;
END;
$$;


-- ============================================================
-- 21. ATTENDANCE LOG TRIGGER
-- ============================================================

CREATE TRIGGER attendance_log_trigger
AFTER INSERT ON public.attendance
FOR EACH ROW
EXECUTE FUNCTION public.create_attendance_log();


-- ============================================================
-- 22. PERFORMANCE INDEXES
-- ============================================================

CREATE INDEX idx_students_user_id
ON public.students(user_id);

CREATE INDEX idx_students_class_id
ON public.students(class_id);

CREATE INDEX idx_students_department_id
ON public.students(department_id);

CREATE INDEX idx_students_face_registered
ON public.students(face_registered);

CREATE INDEX idx_subjects_department_id
ON public.subjects(department_id);

CREATE INDEX idx_classes_department_id
ON public.classes(department_id);

CREATE INDEX idx_classes_teacher_id
ON public.classes(teacher_id);

CREATE INDEX idx_attendance_date
ON public.attendance(date);

CREATE INDEX idx_attendance_student_id
ON public.attendance(student_id);

CREATE INDEX idx_attendance_class_id
ON public.attendance(class_id);

CREATE INDEX idx_attendance_subject_id
ON public.attendance(subject_id);

CREATE INDEX idx_attendance_teacher_id
ON public.attendance(teacher_id);

CREATE INDEX idx_attendance_student_subject_date
ON public.attendance(student_id, subject_id, date);

CREATE INDEX idx_notifications_user_id
ON public.notifications(user_id);

CREATE INDEX idx_profiles_role
ON public.profiles(role);

CREATE INDEX idx_face_samples_student_id
ON public.face_samples(student_id);

CREATE INDEX idx_attendance_logs_student_id
ON public.attendance_logs(student_id);

CREATE INDEX idx_attendance_logs_date
ON public.attendance_logs(date);


-- ============================================================
-- 23. DEFAULT DEPARTMENTS
-- ============================================================

INSERT INTO public.departments
    (name, code, head_of_department)
VALUES
    ('Computer Science', 'CSE', 'Dr. John Smith'),
    ('Electronics & Communication', 'ECE', 'Dr. Jane Doe'),
    ('Mechanical Engineering', 'ME', 'Dr. Robert Johnson'),
    ('Civil Engineering', 'CE', 'Dr. Sarah Williams'),
    ('Electrical Engineering', 'EEE', 'Dr. Michael Brown'),
    ('AI & Machine Learning', 'AIML', 'Dr. Lisa Chen'),
    ('Data Science', 'DS', 'Dr. James Wilson');


-- ============================================================
-- 24. DEFAULT SETTINGS
-- ============================================================

INSERT INTO public.settings
    (key, value)
VALUES
    (
        'attendance_confidence_threshold',
        '{"value": 0.70}'::jsonb
    ),
    (
        'face_registration_required',
        '{"value": true}'::jsonb
    ),
    (
        'system_name',
        '{"value": "AI Face Recognition Attendance System"}'::jsonb
    );


-- ============================================================
-- 25. CREATE PROFILES FOR EXISTING AUTH USERS
-- ============================================================

INSERT INTO public.profiles (
    id,
    full_name,
    email,
    role
)
SELECT
    u.id,

    COALESCE(
        NULLIF(
            TRIM(
                u.raw_user_meta_data ->> 'full_name'
            ),
            ''
        ),
        'Unknown User'
    ),

    COALESCE(
        u.email,
        ''
    ),

    'student'::public.user_role

FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = u.id
);


-- ============================================================
-- 26. FINAL CHECK
-- ============================================================

DO $$
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'profiles'
    ) THEN
        RAISE EXCEPTION 'ERROR: profiles table was not created';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'students'
    ) THEN
        RAISE EXCEPTION 'ERROR: students table was not created';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'attendance'
    ) THEN
        RAISE EXCEPTION 'ERROR: attendance table was not created';
    END IF;

    RAISE NOTICE '==============================================';
    RAISE NOTICE 'AI FACE ATTENDANCE DATABASE READY';
    RAISE NOTICE 'All tables, policies, functions and triggers created.';
    RAISE NOTICE '==============================================';

END
$$;


COMMIT;