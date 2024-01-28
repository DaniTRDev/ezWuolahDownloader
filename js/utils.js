export function getWuolahFileIdFromStr(str)
{
    return new Promise((resolve, reject) => 
    {
        let idStr = str;
        if (str.includes("wuolah.com")) //url
        {
            idStr = "";
            for(let i = (str.indexOf("?") - 1); (i > 0); i--)
            {
                let ch = str[i];

                if (isNaN(ch - parseFloat(ch)))
                    break;

                idStr = ch + idStr;
            }  

            if (idStr.length == 0)
                reject("Given string does not have a valid format");

        }

        resolve(parseInt(idStr));
    });
}

const AES_KEY = "2e35f242a46d67eeb74aabc37d5e5d05";
export function getEncryptedCookie(name)
{
    let keyName = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) 
    {
      let c = ca[i];
      while (c.charAt(0) == ' ') 
        c = c.substring(1);
      
      if (c.indexOf(keyName) == 0) 
        return CryptoJS.AES.decrypt(c.substring(keyName.length, c.length), AES_KEY).toString(CryptoJS.enc.Utf8);
    
    }
    return "";
}

export function setEncryptedCookie(name, data, expirationDateStr) {
   
    let cookie = name + "=" + CryptoJS.AES.encrypt(data, AES_KEY).toString();

    if (expirationDateStr !== undefined)
    { 
        let date = new Date(expirationDateStr);
        cookie += "; expires=" + date.toUTCString();
    }
    document.cookie = cookie;
}