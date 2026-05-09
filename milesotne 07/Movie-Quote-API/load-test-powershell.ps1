# Simple PowerShell load test for Movie Quote API
# Simulates 50 concurrent users making requests over 30 seconds

$targetUrl = "http://localhost:3002"
$duration = 30  # seconds
$concurrentUsers = 50
$metrics = @{
    unpaginatedTimes = @()
    paginatedTimes = @()
    postTimes = @()
    unpaginatedErrors = 0
    paginatedErrors = 0
    postErrors = 0
    unpaginatedCount = 0
    paginatedCount = 0
    postCount = 0
}

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
$jobs = @()

Write-Host "Starting load test with $concurrentUsers concurrent users for $duration seconds..."
Write-Host "Target: $targetUrl"
Write-Host ""

# Function to test unpaginated endpoint
function Test-Unpaginated {
    param([int]$userId)
    
    while ([System.Diagnostics.Stopwatch]::GetTotalSeconds($global:stopwatch) -lt $global:duration) {
        try {
            $time = Measure-Command {
                $response = Invoke-WebRequest -Uri "$($global:targetUrl)/api/quotes/unpaginated" -UseBasicParsing -ErrorAction Stop
            }
            $global:metrics.unpaginatedTimes += $time.TotalMilliseconds
            $global:metrics.unpaginatedCount++
        }
        catch {
            $global:metrics.unpaginatedErrors++
        }
    }
}

# Function to test paginated endpoint
function Test-Paginated {
    param([int]$userId)
    
    while ([System.Diagnostics.Stopwatch]::GetTotalSeconds($global:stopwatch) -lt $global:duration) {
        try {
            $time = Measure-Command {
                $response = Invoke-WebRequest -Uri "$($global:targetUrl)/api/quotes?page=1&limit=20" -UseBasicParsing -ErrorAction Stop
            }
            $global:metrics.paginatedTimes += $time.TotalMilliseconds
            $global:metrics.paginatedCount++
        }
        catch {
            $global:metrics.paginatedErrors++
        }
    }
}

# Function to test POST endpoint
function Test-PostFavorites {
    param([int]$userId)
    
    while ([System.Diagnostics.Stopwatch]::GetTotalSeconds($global:stopwatch) -lt $global:duration) {
        try {
            $time = Measure-Command {
                $response = Invoke-WebRequest -Uri "$($global:targetUrl)/api/favorites" -Method POST `
                    -ContentType "application/json" `
                    -Body "{`"quoteId`": $($userId % 1000 + 1)}" `
                    -UseBasicParsing -ErrorAction Stop
            }
            $global:metrics.postTimes += $time.TotalMilliseconds
            $global:metrics.postCount++
        }
        catch {
            $global:metrics.postErrors++
        }
    }
}

# Start background jobs for concurrent load
# Split users: 25 for unpaginated, 25 for paginated (50 total)
for ($i = 0; $i -lt 25; $i++) {
    $jobs += Start-Job -ScriptBlock ${function:Test-Unpaginated} -ArgumentList $i
    $jobs += Start-Job -ScriptBlock ${function:Test-Paginated} -ArgumentList ($i + 25)
}

Write-Host "Jobs started: $(($jobs | Measure-Object).Count)"
Write-Host "Testing for $duration seconds..."

# Wait for all jobs to complete
Wait-Job -Job $jobs

Write-Host ""
Write-Host "Load test completed!"
Write-Host ""

# Calculate metrics
function CalculateStats {
    param([array]$times)
    
    if ($times.Count -eq 0) { return $null }
    
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

# Get results from jobs
$results = Receive-Job -Job $jobs -Wait

# Calculate statistics
$unpaginatedStats = CalculateStats -times $metrics.unpaginatedTimes
$paginatedStats = CalculateStats -times $metrics.paginatedTimes
$postStats = CalculateStats -times $metrics.postTimes

Write-Host "╔════════════════════════════════════════════════════════════════╗"
Write-Host "║           MOVIE QUOTE API - LOAD TEST RESULTS                  ║"
Write-Host "╚════════════════════════════════════════════════════════════════╝"
Write-Host ""

Write-Host "UNPAGINATED ENDPOINT: GET /api/quotes/unpaginated"
Write-Host "─────────────────────────────────────────────────────"
Write-Host "Total Requests: $($metrics.unpaginatedCount)"
Write-Host "Errors: $($metrics.unpaginatedErrors)"
Write-Host "Median Response Time: $($unpaginatedStats.median) ms"
Write-Host "P95 Response Time: $($unpaginatedStats.p95) ms"
Write-Host "Min Response Time: $($unpaginatedStats.min) ms"
Write-Host "Max Response Time: $($unpaginatedStats.max) ms"
Write-Host "Avg Response Time: $($unpaginatedStats.avg) ms"
Write-Host "Throughput: $([Math]::Round($metrics.unpaginatedCount / $duration, 2)) req/sec"
Write-Host ""

Write-Host "PAGINATED ENDPOINT: GET /api/quotes?page=1&limit=20"
Write-Host "─────────────────────────────────────────────────────"
Write-Host "Total Requests: $($metrics.paginatedCount)"
Write-Host "Errors: $($metrics.paginatedErrors)"
Write-Host "Median Response Time: $($paginatedStats.median) ms"
Write-Host "P95 Response Time: $($paginatedStats.p95) ms"
Write-Host "Min Response Time: $($paginatedStats.min) ms"
Write-Host "Max Response Time: $($paginatedStats.max) ms"
Write-Host "Avg Response Time: $($paginatedStats.avg) ms"
Write-Host "Throughput: $([Math]::Round($metrics.paginatedCount / $duration, 2)) req/sec"
Write-Host ""

Write-Host "POST ENDPOINT: POST /api/favorites"
Write-Host "─────────────────────────────────────────────────────"
Write-Host "Total Requests: $($metrics.postCount)"
Write-Host "Errors: $($metrics.postErrors)"
Write-Host "Median Response Time: $($postStats.median) ms"
Write-Host "P95 Response Time: $($postStats.p95) ms"
Write-Host "Min Response Time: $($postStats.min) ms"
Write-Host "Max Response Time: $($postStats.max) ms"
Write-Host "Avg Response Time: $($postStats.avg) ms"
Write-Host "Throughput: $([Math]::Round($metrics.postCount / $duration, 2)) req/sec"
Write-Host ""

Write-Host "COMPARISON: Unpaginated vs Paginated"
Write-Host "────────────────────────────────────"
$medianImprovement = [Math]::Round($unpaginatedStats.median / $paginatedStats.median, 2)
$p95Improvement = [Math]::Round($unpaginatedStats.p95 / $paginatedStats.p95, 2)
$throughputImprovement = [Math]::Round($metrics.paginatedCount / $metrics.unpaginatedCount, 2)

Write-Host "Median Response Time Improvement: ${medianImprovement}x faster"
Write-Host "P95 Response Time Improvement: ${p95Improvement}x faster"
Write-Host "Throughput Improvement: ${throughputImprovement}x more requests/sec"
Write-Host ""

# Cleanup
Remove-Job -Job $jobs -Force
