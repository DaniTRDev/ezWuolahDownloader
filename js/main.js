import { loginButtonHandler, logoutButtonHandler, downloadButtonHandler } from "./htmlHandlers.js";
import { getWuolahFileIdFromStr } from "./utils.js";
import { isUserLoged } from "./wuolah/api.js";

const aesKey = "2e35f242a46d67eeb74aabc37d5e5d05";
const version = chrome.runtime.getManifest().version;

$(function()
{
    if (isUserLoged())
    {
        $("#download-file-form").show();
        $("#logout-button").show();
    }
    else
    {
        $("#login-form").show();
    }

    $("#login-form-button").bind("click", function()
    {
        let email = $("input[id=email]").val();
        let password = $("input[id=password]").val();

        loginButtonHandler(email, password);
    });

    $("#logout-button").bind("click", function()
    {
        logoutButtonHandler();
    });

     $("#login-form-button").bind("click", function()
    {
        let urlOrId = $("input[id=wuolahFileId]").val();
        downloadButtonHandler(getWuolahFileIdFromStr(urlOrId));
    });
});