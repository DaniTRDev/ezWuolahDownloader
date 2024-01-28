import { getEncryptedCookie, setEncryptedCookie } from "./../utils.js";
import { wuolahApiRequest, isUserLoged } from "./api.js";

export function loginButtonHandler(email, password)
{
    setEncryptedCookie("email", email);
    setEncryptedCookie("password", password);

    new wuolahApiRequest().login(email, password)
    .then((res) =>
    {
        setEncryptedCookie("token", res.accessToken, res.expires);
        window.location.href = "./index.html"; //reload
    })
    .catch(e => console.error("There was an error in the request:" + e));
}

export function logoutButtonHandler()
{
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) //just add an expired-expiration day for each cookie
    {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    window.location.href = "./index.html"; //reload
}

export function downloadFileButtonHandler(fileId)
{
   if (!isUserLoged()) 
   { //asume we have already saved both email & password
        new wuolahApiRequest().login(getEncryptedCookie("email"), getEncryptedCookie("password"))
        .then(res =>
        {
            setEncryptedCookie("token", res.accessToken, res.expires);
            downloadFileButtonHandler(fileId);
        })
        .catch(e => console.error("There was an error in the request:" + e));
   }

    new wuolahApiRequest().downloadFile(fileId, "123")
   .then(res => 
   {
       if (res.url === undefined)
       {
           console.error("Could not generate a downlad link");
           return;
       }

       chrome.downloads.download({ url: res.url});
    })
   .catch(e => console.error("There was an error in the request:" + e));
}

export function downloadFolderButtonHandler(folderId)
{
    if (!isUserLoged())
    { //asume we have already saved both email & password
        new wuolahApiRequest().login(getEncryptedCookie("email"), getEncryptedCookie("password"))
        .then(res =>
        {
            setEncryptedCookie("token", res.accessToken, res.expires);
            downloadFolderButtonHandler(folderId);
        })
        .catch(e => console.error("There was an error in the request:" + e));
    }

    new wuolahApiRequest().downloadFolder(folderId)
    .then((res) =>
    {
        if (res.numFiles === undefined || res.fileIds === undefined)
        {
            console.error("Could not get file IDs from folder");
            return;
        }

        for (let i = 0; i < res.numFiles; i++)
            downloadFileButtonHandler(res.fileIds[i]);
    })
    .catch(e => console.error("There was an error in the request:" + e));
}