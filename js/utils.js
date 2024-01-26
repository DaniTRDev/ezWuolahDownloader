export function getWuolahFileIdFromStr(str)
{
    return new Promise((resolve, reject) => 
    {
        let idStr = str;
        if (str.includes("wuolah.com")) //url
        {
            idStr = "";
            for(let i = str.indexOf("?") - 1; (i > 0); i--)
            {
                if (!isNaN(strCharacter - parseFloat(strCharacter)))
                    reject("Given string does not have a valid format");

                idStr = str[i] + idStr;
            }    
        }

        return parseInt(idStr);
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

export function setEncryptedCookie(name, data)
{
    document.cookie += name + "=" + CryptoJS.AES.encrypt(data, AES_KEY).toString();
}