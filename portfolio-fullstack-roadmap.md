# Full-Stack Portfolio Project Roadmap

## Project Name

Team Knowledge Hub + AI Assistant

## Project Summary

เว็บแอปสำหรับจัดเก็บเอกสาร ความรู้ภายในทีม SOP FAQ และบันทึกต่าง ๆ พร้อมระบบค้นหาและ AI ช่วยสรุปหรือช่วยตอบคำถามจากข้อมูลในระบบ เหมาะสำหรับใช้เป็นโปรเจก Portfolio สาย Full-Stack เพราะแสดงให้เห็นทั้งการทำ Frontend, Backend, Database, Auth, File Handling, Search, AI Integration และ Deployment

## Main Goal

สร้างโปรเจกที่ดูเหมือนระบบใช้งานจริงในบริษัท โดยมีคุณสมบัติพอให้ใช้เล่าใน Portfolio และการสัมภาษณ์ได้อย่างชัดเจนภายใน 2-3 สัปดาห์

## Success Criteria

- มีระบบล็อกอินและจัดการสิทธิ์ผู้ใช้
- ผู้ใช้สามารถสร้าง แก้ไข ลบ และค้นหาเอกสารได้
- ผู้ใช้สามารถขอ AI ให้สรุปเอกสารและถามคำถามจากเอกสารได้
- มี dashboard สรุปข้อมูลการใช้งานพื้นฐาน
- ระบบ deploy ใช้งานออนไลน์ได้จริง
- มี README อธิบายโปรเจก วิธีติดตั้ง และฟีเจอร์หลัก

## Recommended Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Next.js Route Handlers / Server Actions
- Database: Supabase PostgreSQL
- Auth: Supabase Auth
- Storage: Supabase Storage
- AI API: Gemini API
- Email optional: Resend
- Deployment: Vercel

## Free Tier Strategy

### Supabase

ใช้สำหรับ database, auth, storage ในตัวเดียวเพื่อลดความซับซ้อนและลดต้นทุน

Free tier ที่อ้างอิงได้ตอนนี้:

- 2 free projects
- 500 MB database ต่อ project
- 1 GB storage
- 50,000 MAU
- 500,000 edge function invocations

### Gemini API

ใช้สำหรับ:

- summary ของเอกสาร
- Q&A จากเนื้อหาเอกสาร

แนวทางควบคุมค่าใช้จ่าย:

- เรียก AI เฉพาะเมื่อผู้ใช้กดใช้งาน
- cache ผลลัพธ์ summary ลง database
- จำกัดจำนวนข้อความถามต่อวันหรือ ต่อเอกสาร
- เริ่มจาก `Gemini 2.5 Flash`

### Resend

ใช้เฉพาะถ้าต้องการ feature email เพิ่มเติมภายหลัง เช่น แจ้งเตือน หรือ invite user

## Scope Definition

### MVP Scope

ต้องมีในเวอร์ชันแรก:

- Sign up / Sign in / Sign out
- Role-based access แบบ `admin` และ `member`
- Document CRUD
- Tag / category
- Search และ filter
- Upload file หรือ paste content
- AI summary
- AI Q&A ต่อเอกสาร
- Activity log
- Dashboard พื้นฐาน
- Responsive UI
- Deploy ใช้งานจริง

### Nice to Have

ทำถ้ามีเวลาเหลือ:

- Bookmark / Favorite documents
- Document versioning แบบง่าย
- Semantic search ด้วย embeddings
- Email notification
- Basic automated tests

### Out of Scope

ยังไม่ทำในรอบแรก:

- Realtime collaborative editor
- OCR
- Multi-tenant organizations
- Billing / subscription
- Google Drive / Notion sync
- Advanced analytics

## Users and Roles

### Admin

- จัดการเอกสารทุกชิ้น
- จัดการ tag/category
- ดู dashboard ทั้งระบบ
- ดู activity log

### Member

- สร้างและแก้ไขเอกสารของตัวเอง
- ค้นหาและอ่านเอกสาร
- ใช้ AI summary และ Q&A

## Core User Flows

### Flow 1: Authentication

1. ผู้ใช้สมัครสมาชิก
2. เข้าสู่ระบบ
3. เข้าหน้า dashboard

### Flow 2: Create Document

1. ผู้ใช้กดสร้างเอกสาร
2. กรอก title, content, tags, category
3. บันทึกเอกสาร
4. ระบบเก็บ activity log

### Flow 3: Search and Read

1. ผู้ใช้ค้นหาด้วย keyword
2. filter ตาม tag หรือ category
3. เปิดหน้า document detail

### Flow 4: AI Summary

1. ผู้ใช้เปิดเอกสาร
2. กดปุ่ม summarize
3. ระบบเรียก Gemini API
4. บันทึก summary ไว้ใน database
5. แสดงผลให้ผู้ใช้

### Flow 5: Ask AI About Document

1. ผู้ใช้เปิดเอกสาร
2. พิมพ์คำถาม
3. ระบบส่งเนื้อหาเอกสาร + คำถามไปยัง Gemini API
4. แสดงคำตอบและบันทึก conversation

## Information Architecture

### Main Pages

- `/`
- `/login`
- `/signup`
- `/dashboard`
- `/documents`
- `/documents/new`
- `/documents/[id]`
- `/documents/[id]/edit`
- `/admin`
- `/settings`

### Main Components

- Navbar
- Sidebar
- Search bar
- Document card
- Tag badge
- Editor form
- AI summary panel
- AI chat panel
- Dashboard stats cards
- Activity list

## Database Plan

### Tables

#### `profiles`

- `id`
- `email`
- `full_name`
- `role`
- `created_at`

#### `documents`

- `id`
- `author_id`
- `title`
- `slug`
- `content`
- `category`
- `status`
- `summary`
- `created_at`
- `updated_at`

#### `tags`

- `id`
- `name`
- `created_at`

#### `document_tags`

- `document_id`
- `tag_id`

#### `activity_logs`

- `id`
- `user_id`
- `document_id`
- `action`
- `metadata`
- `created_at`

#### `ai_conversations`

- `id`
- `document_id`
- `user_id`
- `question`
- `answer`
- `created_at`

### Future Tables

- `document_versions`
- `favorites`
- `embeddings`

## API and Backend Responsibilities

### Auth

- register user
- login user
- logout user
- protect private routes

### Documents

- create document
- read document
- update document
- delete document
- list documents
- search documents

### AI

- summarize document
- answer question based on one document
- cache AI output

### Logging

- log document creation
- log updates
- log deletes
- log AI usage

## UI/UX Requirements

- ใช้งานได้ดีบน desktop และ mobile
- มี loading states ทุก action ที่สำคัญ
- มี empty states สำหรับ list/search
- มี error messages ที่ชัดเจน
- ใช้ visual hierarchy ชัด ไม่รก
- document detail ต้องอ่านง่าย

## Security and Validation

- ตรวจสอบ session ทุก route ที่เป็น private
- ใช้ role checks ใน admin actions
- validate input ทั้ง client และ server
- จำกัดการเข้าถึงเอกสารที่ไม่ควรเห็น
- จำกัดความยาว input สำหรับ AI prompt
- sanitize หรือจัดการ content ก่อนส่งเข้าระบบ AI

## Development Timeline

## Week 1: Foundation and Core CRUD

### Day 1

- สร้างโปรเจก Next.js
- ตั้งค่า TypeScript, Tailwind, ESLint
- วาง folder structure
- ตั้งค่า env variables
- ทำ layout หลัก

Deliverable:

- project bootstrapped
- app run ได้ใน local

### Day 2

- เชื่อม Supabase
- ทำ auth flow
- สร้าง protected routes
- ทำหน้า login / signup

Deliverable:

- ผู้ใช้สมัครและล็อกอินได้

### Day 3

- ออกแบบ schema
- สร้าง tables
- ตั้ง RLS policy เบื้องต้น

Deliverable:

- database พร้อมใช้งาน

### Day 4

- ทำหน้า documents list
- ทำหน้า create document
- ทำหน้า detail document

Deliverable:

- สร้างและดูเอกสารได้

### Day 5

- ทำ edit / delete document
- เพิ่ม tags และ category
- เก็บ activity logs

Deliverable:

- CRUD ครบ

### Day 6

- ทำ search
- ทำ filter และ sorting
- ปรับ UX list page

Deliverable:

- ค้นหาและกรองเอกสารได้

### Day 7

- เก็บรายละเอียด UI
- loading state
- empty state
- error state
- responsive fixes

Deliverable:

- core app ดูสมบูรณ์ระดับ MVP

## Week 2: AI and Dashboard

### Day 8

- เชื่อม Gemini API
- ทำ backend function สำหรับ summarize
- บันทึก summary ลง database

Deliverable:

- summarize เอกสารได้

### Day 9

- ทำ AI summary panel
- ทำปุ่ม regenerate summary

Deliverable:

- UI summary ใช้งานได้จริง

### Day 10

- ทำ Ask AI about this document
- ส่งคำถามพร้อม context เอกสาร
- บันทึก Q&A history

Deliverable:

- chat ต่อเอกสารได้

### Day 11

- ทำ dashboard
- จำนวนเอกสารทั้งหมด
- category / tag ยอดนิยม
- recent activity

Deliverable:

- dashboard ใช้งานได้

### Day 12

- ทำ role-based access
- แยกสิทธิ์ admin/member
- ป้องกัน action ที่ไม่ควรทำได้

Deliverable:

- permission ชัดเจน

### Day 13

- refactor code
- เพิ่ม validation
- ปรับ error handling
- เก็บ technical debt รอบแรก

Deliverable:

- codebase พร้อม deploy

### Day 14

- deploy production
- test happy paths
- เขียน README
- เตรียม screenshots และ project description

Deliverable:

- โปรเจกออนไลน์พร้อมใส่ Portfolio

## Week 3: Optional Upgrade Week

ทำเฉพาะเมื่อ 2 สัปดาห์แรกเสร็จจริง

### Option A: Better Search

- เพิ่ม embeddings
- semantic search

### Option B: Better Product Feel

- favorites
- document version history

### Option C: Better Engineering Signal

- unit tests
- integration tests
- CI workflow

## Folder Structure Suggestion

```txt
src/
  app/
    (auth)/
    dashboard/
    documents/
    admin/
    api/
  components/
  features/
    auth/
    documents/
    ai/
    dashboard/
  lib/
    supabase/
    ai/
    utils/
    validations/
  types/
```

## Milestones

### Milestone 1

Auth + database + protected app shell

### Milestone 2

Document CRUD + search + tags

### Milestone 3

AI summary + document Q&A

### Milestone 4

Dashboard + activity log + deploy

## Testing Plan

### Manual Test Checklist

- สมัครสมาชิกได้
- ล็อกอินและล็อกเอาต์ได้
- สร้างเอกสารได้
- แก้ไขและลบเอกสารได้
- ค้นหาเอกสารด้วย keyword ได้
- filter ตาม tag/category ได้
- สรุปเอกสารด้วย AI ได้
- ถามคำถามจากเอกสารได้
- dashboard แสดงข้อมูลได้
- mobile layout ใช้งานได้

### If Time Allows

- unit test validation logic
- integration test document create flow
- e2e test login and create document

## README Content Plan

README ควรมี:

- project overview
- screenshots
- tech stack
- features
- setup steps
- environment variables
- architecture summary
- deployment link

## Portfolio Positioning

เวลาเอาไปใส่ Portfolio หรือเล่าในสัมภาษณ์ ให้เน้นประเด็นเหล่านี้:

- ออกแบบระบบที่แก้ปัญหาแบบ business use case จริง
- ใช้ auth, permission, database schema, file handling และ AI integration ร่วมกัน
- คิดเรื่อง production readiness เช่น validation, error handling, caching, deployment
- คุม scope ให้ส่งงานได้จริง ไม่บวมเกินไป

## Recommended Build Order

1. Auth
2. Database schema
3. Document CRUD
4. Search and filter
5. AI summary
6. AI Q&A
7. Dashboard
8. Deploy
9. Optional polish

## Final Deliverables

เมื่อจบโปรเจก ควรมีสิ่งเหล่านี้:

- source code บน GitHub
- live demo
- README ที่อ่านแล้วเข้าใจเร็ว
- screenshots หรือ short demo GIF
- project description สำหรับ Portfolio

## Notes

- ถ้าเวลาน้อย ให้ prioritize การทำ flow หลักให้จบก่อน
- อย่าเริ่มด้วยฟีเจอร์ advanced เช่น vector search หรือ realtime collaboration
- เป้าหมายของโปรเจกนี้คือโชว์คุณภาพของการออกแบบระบบและการส่งงานครบ ไม่ใช่ใส่ฟีเจอร์ให้เยอะที่สุด
