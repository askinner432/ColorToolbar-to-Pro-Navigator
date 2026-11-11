param(
    [string]$OutputPath = (Join-Path $PSScriptRoot "ColorToolbarToProNavigator.package")
)

$ErrorActionPreference = "Stop"
$archivePath = [System.IO.Path]::ChangeExtension($OutputPath, ".zip")
$sourceFiles = @(
    @{ Path = "metainfo.xml"; Entry = "metainfo.xml" },
    @{ Path = "classfactory.xml"; Entry = "classfactory.xml" },
    @{ Path = "color-toolbar-to-pronavigator.js"; Entry = "color-toolbar-to-pronavigator.js" },
    @{ Path = "skin\skin.xml"; Entry = "skin/skin.xml" }
)

if (Test-Path -LiteralPath $archivePath) {
    Remove-Item -LiteralPath $archivePath -Force
}

if (Test-Path -LiteralPath $OutputPath) {
    Remove-Item -LiteralPath $OutputPath -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::Open(
    $archivePath,
    [System.IO.Compression.ZipArchiveMode]::Create
)
try {
    foreach ($file in $sourceFiles) {
        $sourcePath = Join-Path $PSScriptRoot $file.Path
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $archive,
            $sourcePath,
            $file.Entry,
            [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
    }
}
finally {
    $archive.Dispose()
}
Move-Item -LiteralPath $archivePath -Destination $OutputPath
& (Join-Path (Split-Path $PSScriptRoot -Parent) "Sync-FspPackage.ps1") -ProjectRoot $PSScriptRoot -PackagePath $OutputPath -PackageName "ColorToolbarToProNavigator.package"
Write-Host "Built $OutputPath"
