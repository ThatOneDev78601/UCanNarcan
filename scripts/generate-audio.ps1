$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$narrator = New-Object System.Speech.Synthesis.SpeechSynthesizer
$narrator.Rate = -1
$steps = Get-Content -LiteralPath '.tmp/audio-text.json' -Raw | ConvertFrom-Json
foreach ($step in $steps) {
  # Candidate clips never overwrite the current published recordings.
  $candidateDir = Join-Path (Get-Location) ".tmp/audio-candidates/$($step.version)"
  New-Item -ItemType Directory -Force -Path $candidateDir | Out-Null
  $wavPath = Join-Path (Get-Location) ".tmp/step-$($step.id).wav"
  $mp3Path = Join-Path $candidateDir "$($step.id).mp3"
  $narrator.SetOutputToWaveFile($wavPath)
  $narrator.Speak($step.text)
  $narrator.SetOutputToNull()
  & ffmpeg -hide_banner -loglevel error -y -i $wavPath -ac 1 -codec:a libmp3lame -b:a 64k $mp3Path
  if ($LASTEXITCODE -ne 0) { throw 'Audio encoding failed.' }
}
$narrator.Dispose()
Get-ChildItem -LiteralPath '.tmp/audio-candidates' -Recurse -File | Select-Object Name,Length
