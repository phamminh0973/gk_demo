# 09. IMS Demo Plan (Material Module Only)

## 1) Muc tieu
Tao IMS demo chay local nhanh nhat, chi gom module Material (master data).

## 2) Pham vi (In Scope)
- Material CRUD:
  - Tao material
  - Xem danh sach material
  - Xem chi tiet material
  - Cap nhat material
  - Xoa material
- Tim kiem/co ban theo `part_number`, `material_name`, `material_type`
- Co san du lieu mau de demo ngay sau khi chay app

## 3) Ngoai pham vi (Out of Scope)
- InventoryLots, InventoryTransactions, QCTests, ProductionBatches
- Auth/RBAC, Kafka, Redis, Docker, frontend React
- Database that (demo dung in-memory de nhanh nhat)

## 4) Kien truc toi gian (bam theo doc, rut gon)
- Backend: Node.js + TypeScript (Express)
- Kieu monolith 1 service
- 3 lop don gian:
  - `material.model.ts` (type + enum)
  - `material.repository.ts` (in-memory store)
  - `material.service.ts` + `material.controller.ts` (business + API)

## 5) Data model Material (theo Domain Model)
- `material_id` (string)
- `part_number` (unique)
- `material_name`
- `material_type` (API, Excipient, Dietary Supplement, Container, Closure, Process Chemical, Testing Material)
- `storage_conditions` (optional)
- `specification_document` (optional)
- `created_date`
- `modified_date`

## 6) API demo
- `GET /health`
- `GET /api/materials?q=&type=`
- `GET /api/materials/:id`
- `POST /api/materials`
- `PUT /api/materials/:id`
- `DELETE /api/materials/:id`

## 7) Ke hoach thuc hien nhanh (30-45 phut)
1. Scaffold project TypeScript toi gian
2. Implement module Material va validation co ban
3. Seed 3 materials mau
4. Chay local va test bang curl/Invoke-RestMethod
5. Hoan tat README huong dan run demo

## 8) Tieu chi hoan thanh
- `npm run dev` chay thanh cong tren local
- CRUD Material hoat dong day du
- Co tai lieu huong dan chay va test nhanh
