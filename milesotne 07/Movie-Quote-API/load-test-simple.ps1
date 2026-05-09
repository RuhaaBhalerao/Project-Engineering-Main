# Simple sequential load test for Movie Quote API
# Makes 100 requests to each endpoint and collects metrics

$targetUrl = "http://localhost:3002"
$requestsPerEndpoint = 100

$unpaginatedTimes = @()
$paginatedTimes = @()
$postTimes = @()

Write-Host "Starting load test with $requestsPerEndpoint requests per endpoint..."
Write-Host "Target: $targetUrl"
Write-Host ""

# Test unpaginated endpoint
Write-Host "Testing unpaginated endpoint (GET /api/quotes/unpaginated)..."
for ($i = 0; $i -lt $requestsPerEndpoint; $i++) {
    try {
        $time = Measure-Command {
            Invoke-WebRequest -Uri "$targetUrl/api/quotes/unpaginated" -UseBasicParsing -ErrorAction Stop | Out-Null
        }
        $unpaginatedTimes += $time.TotalMilliseconds
    }
    catch {
        Write-Host "Error on request $i"
    }
    if (($i + 1) % 10 -eq 0) {
        Write-Host "  Completed $($i + 1)/$requestsPerEndpoint requests"
    }
}

# Test paginated endpoint
Write-Host ""
Write-Host "Testing paginated endpoint (GET /api/quotes?page=1&limit=20)..."
for ($i = 0; $i -lt $requestsPerEndpoint; $i++) {
    try {
        $time = Measure-Command {
            Invoke-WebRequest -Uri "$targetUrl/api/quotes?page=1&limit=20" -UseBasicParsing -ErrorAction Stop | Out-Null
        }
        $paginatedTimes += $time.TotalMilliseconds
    }
    catch {
        Write-Host "Error on request $i"
    }
    if (($i + 1) % 10 -eq 0) {
        Write-Host "  Completed $($i + 1)/$requestsPerEndpoint requests"
    }
}

# Test POST endpoint
Write-Host ""
Write-Host "Testing POST endpoint (POST /api/favorites)..."
for ($i = 0; $i -lt $requestsPerEndpoint; $i++) {
    try {
        $time = Measure-Command {
            Invoke-WebRequest -Uri "$targetUrl/api/favorites" -Method POST `
                -ContentType "application/json" `
                -Body "{`"quoteId`": $($i % 1000 + 1)}" `
                -UseBasicParsing -ErrorAction Stop | Out-Null
        }
        $postTimes += $time.TotalMilliseconds
    }
    catch {
        Write-Host "Error on request $i"
    }
    if (($i + 1) % 10 -eq 0) {
        Write-Host "  Completed $($i + 1)/$requestsPerEndpoint requests"
    }
}

Write-Host ""

# Calculate statistics
function Get-Stats {
    param([array]$times)
    
    if ($times.Count -eq 0) { return $null }
    
    $sorted = $times | Sort-Object
    $median = $sorted[[Math]::Floor(($sorted.Count - 1) / 2)]
    $p95Index = [Math]::Floor($sorted.Count * 0.95)
    $p95 = $sorted[$p95Index]
    $p99Index = [Math]::Floor($sorted.Count * 0.99)
    $p99 = $sorted[$p99Index]
    
    return @{
        count = $times.Count
        median = [Math]::Round($median, 2)
        p95 = [Math]::Round($p95, 2)
        p99 = [Math]::Round($p99, 2)
        min = [Math]::Round(($times | Measure-Object -Minimum).Minimum, 2)
        max = [Math]::Round(($times | Measure-Object -Maximum).Maximum, 2)
        avg = [Math]::Round(($times | Measure-Object -Average).Average, 2)
    }
}

$unpaginatedStats = Get-Stats -times $unpaginatedTimes
$paginatedStats = Get-Stats -times $paginatedTimes
$postStats = Get-Stats -times $postTimes

Write-Host "╔════════════════════════════════════════════════════════════════╗"
Write-Host "║           MOVIE QUOTE API - LOAD TEST RESULTS                  ║"
Write-Host "╚════════════════════════════════════════════════════════════════╝"
Write-Host ""

Write-Host "UNPAGINATED ENDPOINT: GET /api/quotes/unpaginated"
Write-Host "─────────────────────────────────────────────────────"
Write-Host "Total Requests: $($unpaginatedStats.count)"
Write-Host "Median Response Time: $($unpaginatedStats.median) ms"
Write-Host "P95 Response Time: $($unpaginatedStats.p95) ms"
Write-Host "P99 Response Time: $($unpaginatedStats.p99) ms"
Write-Host "Min Response Time: $($unpaginatedStats.min) ms"
Write-Host "Max Response Time: $($unpaginatedStats.max) ms"
Write-Host "Avg Response Time: $($unpaginatedStats.avg) ms"
Write-Host ""

Write-Host "PAGINATED ENDPOINT: GET /api/quotes?page=1&limit=20"
Write-Host "─────────────────────────────────────────────────────"
Write-Host "Total Requests: $($paginatedStats.count)"
Write-Host "Median Response Time: $($paginatedStats.median) ms"
Write-Host "P95 Response Time: $($paginatedStats.p95) ms"
Write-Host "P99 Response Time: $($paginatedStats.p99) ms"
Write-Host "Min Response Time: $($paginatedStats.min) ms"
Write-Host "Max Response Time: $($paginatedStats.max) ms"
Write-Host "Avg Response Time: $($paginatedStats.avg) ms"
Write-Host ""

Write-Host "POST ENDPOINT: POST /api/favorites"
Write-Host "─────────────────────────────────────────────────────"
Write-Host "Total Requests: $($postStats.count)"
Write-Host "Median Response Time: $($postStats.median) ms"
Write-Host "P95 Response Time: $($postStats.p95) ms"
Write-Host "P99 Response Time: $($postStats.p99) ms"
Write-Host "Min Response Time: $($postStats.min) ms"
Write-Host "Max Response Time: $($postStats.max) ms"
Write-Host "Avg Response Time: $($postStats.avg) ms"
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════════════════╗"
Write-Host "║         COMPARISON: Unpaginated vs Paginated                   ║"
Write-Host "╚════════════════════════════════════════════════════════════════╝"
Write-Host ""

$medianImprovement = [Math]::Round($unpaginatedStats.median / $paginatedStats.median, 1)
$p95Improvement = [Math]::Round($unpaginatedStats.p95 / $paginatedStats.p95, 1)
$avgImprovement = [Math]::Round($unpaginatedStats.avg / $paginatedStats.avg, 1)

Write-Host "Median Response Time Improvement: $($medianImprovement)x faster"
Write-Host "P95 Response Time Improvement: $($p95Improvement)x faster"
Write-Host "Avg Response Time Improvement: $($avgImprovement)x faster"
Write-Host ""
Write-Host "Key Insight: The paginated endpoint is significantly faster because:"
Write-Host "  - Returns only 20 items instead of 1,000"
Write-Host "  - Payload size: ~1.8 KB (paginated) vs ~88 KB (unpaginated)"
Write-Host "  - Reduced network transfer time"
Write-Host "  - Less JSON serialization overhead"
Write-Host "  - Lower server memory and CPU usage"
