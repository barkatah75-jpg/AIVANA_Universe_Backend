# =========================================
# 🚀 AIVANA Backend Auto Setup Script
# Author: GPT-5 (for Barkat Ahmad)
# =========================================

Write-Host "🌌 Starting AIVANA Backend Auto Setup..." -ForegroundColor Cyan

# -------------------------
# 1️⃣ Paths & Constants
# -------------------------
$basePath = "C:\AIVANA_Universe\AIVANA_Universe_Backend"
$envFile = "$basePath\.env"
$migrationFile = "$basePath\migrations\001_init.sql"

# -------------------------
# 2️⃣ Generate Random Secrets
# -------------------------
function New-RandomSecret($length = 32) {
    -join ((48..57) + (65..90) + (97..122) | Get-Random -Count $length | ForEach-Object {[char]$_})
}
$ADMIN_SECRET = New-RandomSecret 48
$INTERNAL_CRON_SECRET = New-RandomSecret 48

# -------------------------
# 3️⃣ Create .env file
# -------------------------
$envTemplate = @"
PORT=5000
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/aivana_db
ADMIN_SECRET=$ADMIN_SECRET
INTERNAL_CRON_SECRET=$INTERNAL_CRON_SECRET
"@
Set-Content -Path $envFile -Value $envTemplate -Encoding UTF8
Write-Host "✅ .env file created at: $envFile" -ForegroundColor Green

# -------------------------
# 4️⃣ Database Migration (if psql exists)
# -------------------------
Write-Host "⚙️ Running Postgres migration..."
if (Get-Command psql -ErrorAction SilentlyContinue) {
    try {
        $dbUrl = (Get-Content $envFile | Select-String "DATABASE_URL").ToString().Split('=')[1]
        if ($dbUrl -like "postgres*") {
            & psql $dbUrl -f $migrationFile
            Write-Host "✅ Database tables migrated successfully!" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Please update DATABASE_URL in .env before running migration." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Database migration failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ psql not found. Please install PostgreSQL CLI and re-run this script." -ForegroundColor Yellow
}

# -------------------------
# 5️⃣ Merge Routes in server.js (Auto-check)
# -------------------------
$serverFile = "$basePath\server.js"
if (Test-Path $serverFile) {
    $content = Get-Content $serverFile -Raw
    if ($content -notmatch "api/usage") {
        $mergeCode = @"
const usageRoutes = require("./routes/usage");
const adminRoutes = require("./routes/admin");
const internalRoutes = require("./routes/internal");

app.use("/api/usage", usageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/internal", internalRoutes);
"@
        Add-Content -Path $serverFile -Value "`n$mergeCode"
        Write-Host "✅ Routes merged in server.js" -ForegroundColor Green
    } else {
        Write-Host "✔️ Routes already exist in server.js" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ server.js not found in $basePath" -ForegroundColor Red
}

# -------------------------
# 6️⃣ Test Local Admin API (Optional)
# -------------------------
$localAdminTest = "http://localhost:5000/api/admin/usage"
Write-Host "🔍 Testing local Admin API..."
try {
    $res = curl.exe -s -H "x-admin-secret: $ADMIN_SECRET" $localAdminTest
    Write-Host "Response:" $res
} catch {
    Write-Host "⚠️ Local test skipped (server not running yet)." -ForegroundColor Yellow
}

# -------------------------
# 7️⃣ Show GitHub & Render instructions
# -------------------------
Write-Host "`n🚧 NEXT STEPS (Manual once only):" -ForegroundColor Cyan
Write-Host "1️⃣ Go to Render → 'Environment Variables' → Add:" -ForegroundColor Yellow
Write-Host "   • DATABASE_URL (your real Postgres URL)"
Write-Host "   • ADMIN_SECRET = $ADMIN_SECRET"
Write-Host "   • INTERNAL_CRON_SECRET = $INTERNAL_CRON_SECRET"
Write-Host "2️⃣ Go to GitHub → Settings → Secrets → Actions → Add:" -ForegroundColor Yellow
Write-Host "   • BACKEND_URL = https://aivana-backend.onrender.com"
Write-Host "   • INTERNAL_CRON_SECRET = $INTERNAL_CRON_SECRET"
Write-Host "`n3️⃣ Then in GitHub Actions → Run 'CheckTrials' manually to verify cron." -ForegroundColor Yellow

# -------------------------
# 8️⃣ Summary
# -------------------------
Write-Host "`n==============================" -ForegroundColor DarkCyan
Write-Host "AIVANA Backend Setup Completed!" -ForegroundColor Green
Write-Host "Secrets generated:"
Write-Host "  ADMIN_SECRET = $ADMIN_SECRET"
Write-Host "  INTERNAL_CRON_SECRET = $INTERNAL_CRON_SECRET"
Write-Host "==============================" -ForegroundColor DarkCyan
