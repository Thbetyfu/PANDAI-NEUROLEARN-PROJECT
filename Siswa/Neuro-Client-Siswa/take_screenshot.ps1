Add-Type -AssemblyName System.Windows.Forms,System.Drawing
$Screen = [System.Windows.Forms.Screen]::PrimaryScreen
$Width = $Screen.Bounds.Width
$Height = $Screen.Bounds.Height
$Bitmap = New-Object System.Drawing.Bitmap -ArgumentList $Width, $Height
$Graphics = [System.Drawing.Graphics]::FromImage($Bitmap)
$Graphics.CopyFromScreen(0, 0, 0, 0, $Bitmap.Size)
$Bitmap.Save("C:\Users\thori\Desktop\pandai_verification.png")
$Graphics.Dispose()
$Bitmap.Dispose()
