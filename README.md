# OILPULSE PWA v2 — GitHub-ready

เว็บแอปติดตามข้อมูลราคาน้ำมัน โทน Dark Futuristic รองรับมือถือ/แท็บเล็ต/คอมพิวเตอร์ และติดตั้งเป็น PWA ได้

## ติดตั้งบน GitHub
1. สร้าง GitHub Repository ใหม่
2. แตก ZIP แล้วอัปโหลดไฟล์ทั้งหมดเข้า repository (รวมโฟลเดอร์ `.github`)
3. ไปที่ **Settings → Pages** แล้วเลือก GitHub Actions เป็น Build and deployment
4. Workflow `Deploy OILPULSE to GitHub Pages` จะเผยแพร่เว็บ
5. Workflow `Update EPPO monthly reference data` จะดึงข้อมูลอ้างอิง EPPO ทุกวันและอัปเดตไฟล์ feed (หรือสั่ง Run workflow เองได้ที่ Actions)

## ข้อจำกัดข้อมูลที่ต้องทราบ
เชื่อมต่อ API ทางการ EPPO สำหรับ **ราคาขายปลีกน้ำมันกรุงเทพฯ แบบรายเดือน** ตามเอกสาร API:
https://apidoc.eppo.go.th/

ข้อมูลชุดนี้เป็นราคาอ้างอิงรายเดือน/ค่าเฉลี่ย ไม่ใช่ราคาหน้าปั๊มรายวัน และไม่สามารถใช้ตรวจจับประกาศขึ้น-ลงล่วงหน้าหรือยืนยันราคาของแต่ละแบรนด์/สถานีได้ ดังนั้นแอปจะแสดงชื่อชุดข้อมูลและวันที่ดึงข้อมูลอย่างชัดเจน ไม่แต่งตัวเลขสดขึ้นมา

หากต้องการราคา PTT, บางจาก, Shell, Caltex, PT แบบรายวัน/รายสถานี ต้องเชื่อม API หรือฟีดที่ผู้ให้บริการอนุญาต และต้องมี schema/แหล่งประกาศราคาที่ตรวจสอบได้

## การแจ้งเตือน
ขณะนี้มีส่วนขอสิทธิ์ Notification และบันทึกชนิดน้ำมันที่ติดตามไว้ในเครื่อง การส่ง Push Notification ตอนปิดเว็บต้องเพิ่ม Web Push service, VAPID keys และฐานข้อมูล subscription บน backend/บริการอย่าง Firebase หรือระบบเทียบเท่า รวมถึงต้องมีฟีดประกาศราคาอย่างเป็นทางการที่ระบุเวลาเริ่มใช้ราคา ยังไม่เปิดการแจ้งเตือนล่วงหน้าแบบอัตโนมัติใน ZIP นี้ เพื่อป้องกันการแจ้งเตือนผิดพลาด

## โครงสร้าง
- `index.html`, `styles.css`, `app.js` — หน้าเว็บและการทำงาน
- `manifest.webmanifest`, `sw.js`, `assets/icon.svg` — PWA
- `.github/workflows/pages.yml` — Deploy GitHub Pages
- `.github/workflows/update-eppo.yml` — ดึงข้อมูล EPPO ตามรอบ
- `scripts/fetch_eppo.py` — ตัวดึงข้อมูล EPPO
- `feeds/eppo-monthly.json` — feed ที่เว็บอ่าน

## หมายเหตุ
ราคาจริงอาจแตกต่างตามแบรนด์ สถานี และพื้นที่ โปรดตรวจสอบกับผู้ให้บริการก่อนเติมน้ำมัน
