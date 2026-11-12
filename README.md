# ColorToolbar to Pro Navigator Preset

This Studio Pro 8 script converts a ColorToolbar setup export (`ColorToolbar Setup - Export.txt`) into a Pro Navigator Auto-Color preset (`.autocolorpreset`).

It reads keyword rules from ColorToolbar color groups 1–6, keeping the slot order, RGB hex values, and comma-separated patterns. It skips group 7, which contains the No Match and channel-type colors without keyword patterns. The output uses Pro Navigator's `containsWords` match mode and does not assign icons. The converter does not change existing Pro Navigator rules; it saves a separate preset file.

**Requirement:** This script requires the add-in **Pro Navigator** by Lukas Ruschitzka.

**Description:** Recreates your ColorToolbar keyword colors in Pro Navigator so tracks can use the same coloring rules.

## Usage

1. In ColorToolbar 3, click the down arrow to the left of the **Conform** button. Choose **Export Setup** and save the setup file.
2. Run this script. Select the exported ColorToolbar setup file when prompted, then choose where to save the converted `.autocolorpreset`.
3. In Pro Navigator's **Color Wizard** group, open **Edit Rules**.
4. Click **Manage** at the bottom right and choose **Import**.
5. Select the converted `.autocolorpreset` file.

The converter writes a separate `.autocolorpreset`; it does not modify existing Pro Navigator presets or rules. The **Use gradient** checkbox controls whether generated rules use a gradient. The dialog does not show a rule or color preview.

## Build

Run `build-package.ps1` from PowerShell. It creates `ColorToolbarToProNavigator.package` in this folder.

## Install in Fender Studio Pro 8

Copy the package to:

```text
C:\Program Files\Fender\Studio Pro 8\Scripts\
```

Restart Studio Pro, press **Ctrl+F**, and search for **Convert ColorToolbar Setup to Pro Navigator Preset**. Select the ColorToolbar export and choose where to save the generated preset. Import that `.autocolorpreset` through Pro Navigator's **Edit Rules** window. The command is hidden from the Track menu.

This uses Studio Pro's internal scripting API. The available API documentation is community-maintained and incomplete, so verify the dialog and file operations in the installed Studio Pro version before relying on it for production work.
