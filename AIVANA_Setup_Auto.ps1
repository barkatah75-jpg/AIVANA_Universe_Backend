Write-Host "?? Starting AIVANA Backend Auto Setup..." -ForegroundColor Cyan
$basePath = "C:\AIVANA_Universe\AIVANA_Universe_Backend"
$envFile = "$basePath\.env"
$migrationFile = "$basePath\migrations\001_init.sql"

function New-RandomSecret($length = 32) {
    return -join ((48..57)+(65..90)+(97..122)|Get-Random -Count $length|ForEach-Object{[char]$_})
}

$ADMIN_SECRET = New-RandomSecret 48
$INTERNAL_CRON_SECRET = New-RandomSecret 48

$envTemplate = @"
PORT=5000
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/aivana_db
ADMIN_SECRET=$ADMIN_SECRET
INTERNAL_CRON_SECRET=$INTERNAL_CRON_SECRET
"@
Set-Content -Path $envFile -Value $envTemplate -Encoding UTF8
Write-Host "? .env created at: $envFile" -ForegroundColor Green

Write-Host "?? Checking PostgreSQL..."
if (Get-Command psql -ErrorAction SilentlyContinue) {
    try {
        $dbUrl = ((Get-Content $envFile | Select-String "DATABASE_URL").ToString()).Split('=')[1]
        if ($dbUrl -like "postgres*") {
            & psql $dbUrl -f $migrationFile
            Write-Host "? Migration done!" -ForegroundColor Green
        } else {
            Write-Host "?? Update DATABASE_URL in .env" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "? Migration failed $_" -ForegroundColor Red
    }
} else {
    Write-Host "?? psql not installed (skipped)." -ForegroundColor Yellow
}

$serverFile = "$basePath\server.js"
if (Test-Path $serverFile) {
    $content = Get-Content $serverFile -Raw
    if ($content -notmatch "api/usage") {
        Add-Content -Path $serverFile -Value @"
const usageRoutes = require("./routes/usage");
const adminRoutes = require("./routes/admin");
const internalRoutes = require("./routes/internal");

app.use("/api/usage", usageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/internal", internalRoutes);
"@
        Write-Host "? Routes merged!" -ForegroundColor Green
    } else {
        Write-Host "?? Routes already exist." -ForegroundColor Cyan
    }
} else {
    Write-Host "? server.js missing!" -ForegroundColor Red
}

Write-Host "`n?? NEXT STEPS:" -ForegroundColor Cyan
Write-Host "Render Variables ? DATABASE_URL, ADMIN_SECRET, INTERNAL_CRON_SECRET"
Write-Host "GitHub Secrets ? BACKEND_URL, INTERNAL_CRON_SECRET"
Write-Host "`n=============================="
Write-Host "AIVANA Backend Setup Complete!"
Write-Host "ADMIN_SECRET = $ADMIN_SECRET"
Write-Host "INTERNAL_CRON_SECRET = $INTERNAL_CRON_SECRET"
Write-Host "=============================="
