export function onNavBarChange(name)
{
    $("section").hide(); //hide all sections
    $("#" + name + "-section").show(); //show the section we are interested in
}

$(function ()
{
    const version = chrome.runtime.getManifest().version;
    $("#welcome").append("ezDownloader " + version);

    $("#navbar-nav-home").click(function ()
    {
        onNavBarChange("home");
    });

    $("#navbar-nav-wuolah").click(function ()
    {
        onNavBarChange("wuolah");
    });

    $("#navbar-nav-mediafire").click(function ()
    {
        onNavBarChange("mediafire");
    });
});