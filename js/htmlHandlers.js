import { getEncryptedCookie, setEncryptedCookie } from "./utils.js";
import { wuolahApiRequest, isUserLoged } from "./wuolah/api.js";

export function loginButtonHandler(email, password)
{
    setEncryptedCookie("email", email);
    setEncryptedCookie("password", password);

    let res = new wuolahApiRequest().login(email, password)
    .then((token, expire) =>
    {
        setEncryptedCookie("token", token);
        setEncryptedCookie("expire", expire);
    })
    .catch(e => console.error("There was an error in the request:" + e));
}

export function logoutButtonHandler()
{
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) 
    {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

export function downloadButtonHandler(fileId)
{
   if (!isUserLoged()) 
   {
        return new wuolahApiRequest().login(getEncryptedCookie("email"), getEncryptedCookie("password"))
        .then((token, expire) =>
        {
            getEncryptedCookie("token", token);
            getEncryptedCookie("expire", expire);

            downloadButtonHandler(fileId);
        })
        .catch(e => console.error("There was an error in the request:" + e));
   }

   new wuolahApiRequest().downloadFile(fileId, getEncryptedCookie("machineId"))
   .then(url => 
    {
        windows.open(url);
    });
}

