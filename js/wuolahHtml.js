import { loginButtonHandler, logoutButtonHandler, downloadFileButtonHandler, downloadFolderButtonHandler } from "./wuolah/htmlHandlers.js";
import { getWuolahFileIdFromStr } from "./utils.js";
import { isUserLoged } from "./wuolah/api.js";

$(function ()
{
    if (isUserLoged())
    {
        $("#download-form").show();
    }
    else
    {
        $("#login-form").show();
    }

    $("#wuolah-section").find("#login-form-button").click(function ()
    {
        let email = $("input[id=email]").val();
        let password = $("input[id=password]").val();

        loginButtonHandler(email, password);
    });

    $("#wuolah-section").find("#logout-button").click(function ()
    {
        logoutButtonHandler();
    });

    $("#wuolah-section").find("#download-file-form-button").click(function () {
        let urlOrId = $("input[id=wuolahFileId]").val();

        getWuolahFileIdFromStr(urlOrId)
        .then(id => downloadFileButtonHandler(id))
        .catch(e => console.error("There was an error while retrieving fileId " + e));
    });

    $("#wuolah-section").find("#download-folder-form-button").click(function ()
    {
        let id = $("input[id=wuolahFolderId]").val();
        downloadFolderButtonHandler(id);
    });
});