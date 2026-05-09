$targetUrl = "http://localhost:3002"
$requestsPerEndpoint = 100
$unpaginatedTimes = @()
$paginatedTimes = @()
$postTimes = @()

Write-Host "Starting load test..."
Write-Host ""

Write-Host "Testing unpaginated endpoint..."
for ($i = 0; $i -lt $requestsPerEndpoint; $i++) {
    $time = Measure-Command {
        Invoke-WebRequest -Uri "$targetUrl/api/quotes/unpaginated" -UseBasicParsing -ErrorAction SilentlyContinue | Out-Null
    }
    $unpaginatedTimes += $time.TotalMilliseconds
}

Write-Host "Testing paginated endpoint..."
for ($i = 0; $i -lt $requestsPerEndpoint; $i++) {
    $time = Measure-Command {
        Invoke-WebRequest -Uri "$targetUrl/api/quotes?page=1&limit=20" -UseBasicParsing -ErrorAction SilentlyContinue | Out-Null
    }
    $paginatedTimes += $time.TotalMilliseconds
}

Write-Host "Testing POST endpoint..."
for ($i = 0; $i -lt $requestsPerEndpoint; $i++) {
    $time = Measure-Command {
        Invoke-WebRequest -Uri "$targetUrl/api/favorites" -Method POST -ContentType "application/json" -Body "{`"quoteId`": 42}" -UseBasicParsing -ErrorAction SilentlyContinue | Out-Null
    }
    $postTimes += $time.TotalMilliseconds
}

Write-Host ""

function Get-Stats {
    param([array]$times)
    $sorted = $times | Sort-Object
    $median = $sorted[[Math]::Floor(($sorted.Count - 1) / 2)]
    $p95Index = [Math]::Floor($sorted.Count * 0.95)
    $p95 = $sorted[$p95Index]
    return @{
        count = $times.Count
        median = [Math]::Round($median, 2)
        p95 = [Math]::Round($p95, 2)
        min = [Math]::Round(($times | Measure-Object -Minimum).Minimum, 2)
        max = [Math]::Round(($times | Measure-Object -Maximum).Maximum, 2)
        avg = [Math]::Round(($times | Measure-Object -Average).Average, 2)
    }
}

$unpaginatedStats = Get-Stats -times $unpaginatedTimes
$paginatedStats = Get-Stats -times $paginatedTimes
$postStats = Get-Stats -times $postTimes

Write-Host "MOVIE QUOTE API - LOAD TEST RESULTS"
Write-Host "===================================="
Write-Host ""

Write-Host "UNPAGINATED ENDPOINT: GET /api/quotes/unpaginated"
Write-Host "Requests: $($unpaginatedStats.count)"
Write-Host "Median: $($unpaginatedStats.median) ms"
Write-Host "P95: $($unpaginatedStats.p95) ms"
Write-Host "Min: $($unpaginatedStats.min) ms"
Write-Host "Max: $($unpaginatedStats.max) ms"
Write-Host "Avg: $($unpaginatedStats.avg) ms"
Write-Host ""

Write-Host "PAGINATED ENDPOINT: GET /api/quotes?page=1&limit=20"
Write-Host "Requests: $($paginatedStats.count)"
Write-Host "Median: $($paginatedStats.median) ms"
Write-Host "P95: $($paginatedStats.p95) ms"
Write-Host "Min: $($paginatedStats.min) ms"
Write-Host "Max: $($paginatedStats.max) ms"
Write-Host "Avg: $($paginatedStats.avg) ms"
Write-Host ""

Write-Host "POST ENDPOINT: POST /api/favorites"
Write-Host "Requests: $($postStats.count)"
Write-Host "Median: $($postStats.median) ms"
Write-Host "P95: $($postStats.p95) ms"
Write-Host "Min: $($postStats.min) ms"
Write-Host "Max: $($postStats.max) ms"
Write-Host "Avg: $($postStats.avg) ms"
Write-Host ""

Write-Host "COMPARISON: Unpaginated vs Paginated"
Write-Host "===================================="
$medianImprovement = [Math]::Round($unpaginatedStats.median / $paginatedStats.median, 1)
$p95Improvement = [Math]::Round($unpaginatedStats.p95 / $paginatedStats.p95, 1)
$avgImprovement = [Math]::Round($unpaginatedStats.avg / $paginatedStats.avg, 1)

Write-Host "Median: $($medianImprovement)x faster"
Write-Host "P95: $($p95Improvement)x faster"
Write-Host "Avg: $($avgImprovement)x faster"
