$ErrorActionPreference='Stop'
$root=$PSScriptRoot
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Speech
$scenes=Get-Content "$root\storyboard.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$ffmpeg="$root\tools\package\ffmpeg.exe"
if(!(Test-Path $ffmpeg)){
 Write-Output 'Downloading FFmpeg rendering binary...'
 $meta=Invoke-RestMethod 'https://registry.npmjs.org/@ffmpeg-installer/win32-x64/latest'
 Invoke-WebRequest -UseBasicParsing $meta.dist.tarball -OutFile "$root\tools\ffmpeg.tgz"
 & tar -xf "$root\tools\ffmpeg.tgz" -C "$root\tools"
 if($LASTEXITCODE -ne 0){throw 'FFmpeg extraction failed'}
}
function Color($v){[System.Drawing.ColorTranslator]::FromHtml($v)}
function Text($g,$v,$size,$x,$y,$w,$h,$hex='#EDF5F5',$bold=$false){
 $style=[System.Drawing.FontStyle]::Regular
 if($bold){$style=[System.Drawing.FontStyle]::Bold}
 $font=New-Object System.Drawing.Font('Segoe UI',$size,$style,[System.Drawing.GraphicsUnit]::Pixel)
 $brush=New-Object System.Drawing.SolidBrush((Color $hex))
 $rect=New-Object System.Drawing.RectangleF($x,$y,$w,$h)
 $g.DrawString($v,$font,$brush,$rect)
 $brush.Dispose();$font.Dispose()
}
function Box($g,$x,$y,$w,$h,$hex){
 $b=New-Object System.Drawing.SolidBrush((Color $hex))
 $g.FillRectangle($b,$x,$y,$w,$h);$b.Dispose()
}
function Stamp($v){
 $t=[TimeSpan]::FromSeconds($v)
 '{0:00}:{1:00}:{2:00},{3:000}' -f [math]::Floor($t.TotalHours),$t.Minutes,$t.Seconds,$t.Milliseconds
}
$speaker=New-Object System.Speech.Synthesis.SpeechSynthesizer
$speaker.SelectVoice('Microsoft Zira Desktop');$speaker.Rate=1
$format=New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(24000,[System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,[System.Speech.AudioFormat.AudioChannel]::Mono)
$offset=0.0
$en=New-Object System.Text.StringBuilder
$bn=New-Object System.Text.StringBuilder
$transcript=New-Object System.Text.StringBuilder
$concat=New-Object System.Text.StringBuilder
$nl=[Environment]::NewLine
for($i=0;$i -lt $scenes.Count;$i++){
 $s=$scenes[$i];$id='{0:00}' -f ($i+1)
 Write-Output "Rendering scene $id / $($scenes.Count): $($s.tag)"
 $wav="$root\assets\$id.wav"
 $speaker.SetOutputToWaveFile($wav,$format);$speaker.Speak($s.en);$speaker.SetOutputToNull()
 $seconds=[math]::Ceiling((((Get-Item $wav).Length/48000.0)+0.85)*30)/30
 $bmp=New-Object System.Drawing.Bitmap(1080,1350)
 $g=[System.Drawing.Graphics]::FromImage($bmp)
 $g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
 $g.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
 $g.Clear((Color '#09151E'))
 Box $g 0 0 1080 12 '#55E6BD'
 Box $g 850 12 230 1338 '#0B2029'
 for($n=0;$n -lt 9;$n++){Box $g (884+$n*20) 150 1 970 '#12323C'}
 Text $g 'TW / THEMEWRIGHT' 26 74 62 720 50 '#55E6BD' $true
 Text $g ('{0:00} / 10' -f ($i+1)) 22 888 67 140 45 '#85A5AE'
 Text $g $s.tag 23 76 145 930 45 '#85A5AE' $true
 Text $g $s.title 78 68 206 960 220 '#F4F7F8' $true
 Text $g $s.note 21 76 415 940 65 '#55E6BD' $true
 for($j=0;$j -lt 3;$j++){
  $y=520+$j*190
  Box $g 74 $y 932 166 '#122B35'
  Box $g 74 $y 5 166 '#55E6BD'
  Text $g $s.cards[$j][0] 34 105 ($y+20) 864 52 '#F4F7F8' $true
  Text $g $s.cards[$j][1] 28 105 ($y+79) 858 80 '#B3C9D0'
 }
 Box $g 74 1131 932 1 '#27434D'
 Text $g 'CODE-BASED PROJECT OVERVIEW' 21 76 1164 940 40 '#85A5AE'
 Text $g 'Visual editing. Structured content. Client ownership.' 26 76 1212 940 70 '#E1EBEE'
 Box $g 74 1304 932 5 '#19333F'
 Box $g 74 1304 ([int](932*($i+1)/$scenes.Count)) 5 '#55E6BD'
 $png="$root\assets\$id.png"
 $bmp.Save($png,[System.Drawing.Imaging.ImageFormat]::Png);$g.Dispose();$bmp.Dispose()
 $d=$seconds.ToString('0.000',[System.Globalization.CultureInfo]::InvariantCulture)
 $frames=[int][math]::Round($seconds*30)
 $fade=($seconds-0.28).ToString('0.000',[System.Globalization.CultureInfo]::InvariantCulture)
 $filter="scale=1120:1400,zoompan=z='1.02':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2+8*sin(on/75)':d={0}:s=1080x1350:fps=30,fade=t=in:st=0:d=0.25,fade=t=out:st={1}:d=0.25,format=yuv420p" -f $frames,$fade
 & $ffmpeg -y -hide_banner -loglevel error -i $png -i $wav -vf $filter -af 'apad,loudnorm=I=-16:TP=-1.5:LRA=11' -t $d -c:v libx264 -preset veryfast -crf 21 -c:a aac -b:a 160k -ar 48000 -ac 2 -movflags +faststart "$root\assets\$id.mp4"
 if($LASTEXITCODE -ne 0){throw "Rendering scene $id failed"}
 [void]$concat.AppendLine("file 'D:/mern/cms/social-video/assets/$id.mp4'")
 $start=Stamp $offset;$end=Stamp ($offset+$seconds-0.05)
 [void]$en.AppendLine(($i+1).ToString()+$nl+"$start --> $end"+$nl+$s.en+$nl)
 [void]$bn.AppendLine(($i+1).ToString()+$nl+"$start --> $end"+$nl+$s.bn+$nl)
 [void]$transcript.AppendLine('## '+$s.tag+$nl+$nl+$s.en+$nl+$nl+$s.bn+$nl)
 $offset+=$seconds
}
$speaker.Dispose()
$concat.ToString() | Set-Content "$root\concat.txt" -Encoding ASCII
$en.ToString() | Set-Content "$root\subtitles.en.srt" -Encoding UTF8
$bn.ToString() | Set-Content "$root\subtitles.bn.srt" -Encoding UTF8
$transcript.ToString() | Set-Content "$root\narration.md" -Encoding UTF8
& $ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i "$root\concat.txt" -c copy -movflags +faststart "$root\Themewright-social.mp4"
if($LASTEXITCODE -ne 0){throw 'Video assembly failed'}
Copy-Item "$root\assets\01.png" "$root\cover.png"
@{video='Themewright-social.mp4';width=1080;height=1350;fps=30;durationSeconds=$offset;voice='Microsoft Zira Desktop (synthetic English narration)';visuals='Illustrated code-based overview; not live application footage';scenes=$scenes.Count} | ConvertTo-Json | Set-Content "$root\manifest.json" -Encoding UTF8
Write-Output ("DONE: {0:N1} seconds / {1:N1} MB" -f $offset,((Get-Item "$root\Themewright-social.mp4").Length/1MB))

