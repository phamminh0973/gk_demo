# IMS Demo - Material Module Only

Demo toi gian theo tai lieu IMS, chi implement module Material.

## 1) Chay local
```powershell
cd material-demo
npm install
npm run dev
```

Server mac dinh: `http://localhost:3000`

## 1.1) CI tren GitHub Actions
- Workflow: `.github/workflows/ci-material-demo.yml`
- Trigger: moi lan `push` commit moi len GitHub va co the chay tay bang `workflow_dispatch`
- Build step: `npm ci` va `npm run build` trong thu muc `material-demo`
- Email thong bao: workflow gui mail cho ca hai truong hop build `success` va `failure`

### GitHub Secrets can cau hinh
- `SMTP_SERVER`: host SMTP, vi du `smtp.gmail.com`
- `SMTP_PORT`: cong SMTP, vi du `465` hoac `587`
- `SMTP_USERNAME`: tai khoan SMTP
- `SMTP_PASSWORD`: mat khau SMTP hoac App Password
- `MAIL_FROM`: dia chi nguoi gui, vi du `IMS CI <your-email@gmail.com>`
- `MAIL_TO`: mot hoac nhieu email nhan, cach nhau bang dau phay

Neu dung Gmail, nen dung `SMTP_PORT=465` va tao App Password thay vi dung mat khau dang nhap thong thuong.

## 2) API endpoints
- `GET /health`
- `GET /api/materials?q=&type=`
- `GET /api/materials/:id`
- `POST /api/materials`
- `PUT /api/materials/:id`
- `DELETE /api/materials/:id`

## 3) Test nhanh bang PowerShell
### 3.1 Lay danh sach
```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/materials"
```

### 3.2 Tao material
```powershell
$body = @{
  part_number = "PART-NEW-001"
  material_name = "Lactose Monohydrate"
  material_type = "Excipient"
  storage_conditions = "Room temperature"
  specification_document = "SPEC-EXC-LAC-001"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/materials" -ContentType "application/json" -Body $body
```

### 3.3 Tim kiem
```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/materials?q=vitamin"
```

### 3.4 Loc theo type
```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/materials?type=API"
```

## 4) Ghi chu
- Du lieu dang in-memory (seed 3 materials), dung de demo nhanh.
- Khoi dong lai server se reset du lieu.
