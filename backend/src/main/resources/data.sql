DELETE FROM tasks;

INSERT INTO tasks (title, description, priority, due_date, status, position, created_at, updated_at) VALUES
  ('要件定義書のレビュー', 'docs配下の内容を確認する', 'high', '2026-08-25', 'todo', 0, now(), now()),
  ('画面モックの確認', '', 'medium', NULL, 'todo', 1, now(), now()),
  ('ER図の作成', 'tasksテーブルを設計する', 'medium', '2026-08-22', 'doing', 0, now(), now()),
  ('バックエンド環境構築', 'Spring Boot + PostgreSQLの疎通確認', 'high', '2026-08-21', 'doing', 1, now(), now()),
  ('技術構成の決定', 'React + Spring Boot + PostgreSQL', 'low', NULL, 'done', 0, now(), now());
