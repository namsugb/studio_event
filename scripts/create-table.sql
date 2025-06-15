-- Supabase에서 실행할 테이블 생성 스크립트
CREATE TABLE IF NOT EXISTS studio_reservation (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  photo_types TEXT[] NOT NULL,
  shooting_month VARCHAR(7) NOT NULL,
  privacy_consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE studio_reservation ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 데이터를 삽입할 수 있도록 허용
CREATE POLICY "Enable insert for all users" ON studio_reservation
  FOR INSERT WITH CHECK (true);

-- 관리자만 데이터를 조회할 수 있도록 설정 (선택사항)
CREATE POLICY "Enable read for authenticated users only" ON studio_reservation
  FOR SELECT USING (auth.role() = 'authenticated');
