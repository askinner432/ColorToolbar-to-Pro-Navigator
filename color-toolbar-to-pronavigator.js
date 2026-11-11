var kPackageID = "com.songlens.colortoolbar-to-pronavigator";

function ColorToolbarToProNavigatorTask()
{
    this.interfaces = [Host.Interfaces.IEditTask];

    this.prepareEdit = function (context)
    {
        this.UseGradient = context.parameters.addInteger(0, 1, "UseGradient");
        this.UseGradient.value = 0;
        context.restore();
        return context.runDialog("ColorToolbarConverterDialog", kPackageID);
    };

    this.performEdit = function (context)
    {
        var sourceSelector = Host.Classes.createInstance("CCL:FileSelector");
        sourceSelector.addFilter({ extension: "txt", description: "ColorToolbar setup export (*.txt)" });
        if (sourceSelector.runOpen("Select ColorToolbar Setup Export") !== 1)
            return Host.Results.kResultOk;

        var source = Host.IO.openTextFile(sourceSelector.getPath());
        if (!source)
        {
            Host.GUI.alert("Studio Pro could not open the selected ColorToolbar export.");
            return Host.Results.kResultFailed;
        }

        var rules = parseColorToolbarSetup(source);
        source.close();

        if (rules.length === 0)
        {
            Host.GUI.alert("No keyword rules were found in ColorToolbar color groups 1–6.\n\nSelect a ColorToolbar Setup Export.txt file.");
            return Host.Results.kResultFailed;
        }

        var useGradient = this.UseGradient && this.UseGradient.value === 1;
        var saveSelector = Host.Classes.createInstance("CCL:FileSelector");
        saveSelector.addFilter({ extension: "autocolorpreset", description: "Pro Navigator Auto-Color Preset (*.autocolorpreset)" });
        saveSelector.setFileName("ColorToolbar Converted.autocolorpreset");
        if (saveSelector.runSave("Save Pro Navigator Auto-Color Preset") !== 1)
            return Host.Results.kResultOk;

        var destination = Host.IO.createTextFile(saveSelector.getPath());
        if (!destination)
        {
            Host.GUI.alert("Studio Pro could not create the selected preset file.");
            return Host.Results.kResultFailed;
        }

        destination.writeLine('<?xml version="1.0" encoding="UTF-8"?>');
        destination.writeLine("<AutoColorRules>");
        for (var i = 0; i < rules.length; i++)
        {
            var rule = rules[i];
            destination.writeLine(
                '\t<Rule patterns="' + xmlEscape(rule.patterns.join(", ")) +
                '" matchMode="containsWords" color="#' + rule.color +
                '" gradient="' + (useGradient ? "1" : "0") + '"/>');
        }
        destination.writeLine("</AutoColorRules>");
        destination.close();

        Host.GUI.alert("Saved " + rules.length + " rules to the selected Pro Navigator preset file.");
        return Host.Results.kResultOk;
    };
}

function parseColorToolbarSetup(file)
{
    var rules = [];
    var group = 0;
    var groupHeader = /^\*\*\*\s*Color Group\s+(\d+)/i;

    while (!file.endOfStream)
    {
        var line = trimText(file.readLine());
        if (!line)
            continue;

        var header = line.match(groupHeader);
        if (header)
        {
            group = parseInt(header[1], 10);
            continue;
        }

        if (group < 1 || group > 6 || line.charAt(0) === "*")
            continue;

        var fields = line.split("|");
        if (fields.length < 3)
            continue;

        var color = trimText(fields[0]).toUpperCase();
        if (!/^[0-9A-F]{6}$/.test(color))
            continue;

        var keywordText = fields.slice(2).join("|");
        var patterns = keywordText.split(",");
        var cleanPatterns = [];
        for (var i = 0; i < patterns.length; i++)
        {
            var pattern = trimText(patterns[i]);
            if (pattern)
                cleanPatterns.push(pattern);
        }

        if (cleanPatterns.length > 0)
            rules.push({ color: color, patterns: cleanPatterns });
    }

    return rules;
}

function trimText(value)
{
    return String(value).replace(/^\s+|\s+$/g, "");
}

function xmlEscape(value)
{
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function createInstance()
{
    return new ColorToolbarToProNavigatorTask();
}
