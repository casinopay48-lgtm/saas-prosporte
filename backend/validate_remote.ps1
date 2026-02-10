try {
  $response = Invoke-RestMethod -Method Post -Uri 'https://api.prosporte.com.br/api/v1/auth/login' -Body (ConvertTo-Json @{ email='admin@saasportes.com'; password='Admin@123' }) -ContentType 'application/json' -ErrorAction Stop
  Write-Output '---LOGIN RESPONSE---'
  $response | ConvertTo-Json -Depth 10

  $token = $response.token
  Write-Output '---TOKEN---'
  Write-Output $token

  Write-Output '---ME RESPONSE---'
  $me = Invoke-RestMethod -Method Get -Uri 'https://api.prosporte.com.br/api/v1/auth/me' -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
  $me | ConvertTo-Json -Depth 10
} catch {
  Write-Output '---ERROR---'
  Write-Output $_.Exception.Message
  if ($_.Exception.Response) {
    try { $_.Exception.Response | ConvertTo-Json -Depth 5 } catch { Write-Output 'Could not serialize response.' }
  }
  exit 1
}
