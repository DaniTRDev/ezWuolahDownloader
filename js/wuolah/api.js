import { getEncryptedCookie, setEncryptedCookie } from "./../utils.js";

export class wuolahApiRequest
{
    constructor() 
    {
        this.body = {};
        this.headers = "";
        this.path = "";
        this.url = "https://api.wuolah.com/";
    }

    login(email, id)
    {
        return new Promise((resolve, reject) => 
        {
            this.body = JSON.stringify
            ({ 
                "account": email, 
                "password": id 
            });
    
            this.headers = 
            {
                method: "POST",
                mode: "cors",
                headers: 
                {
                   "Content-Type": "application/json",
                    "Content-length": this.body.length
                },
                body: JSON.stringify(this.body)
            }
            this.path = "/login";
            fetch(this.url +  this.path, this.headers)
            .then(res => res.json().then(json => resolve(json.accessToken, json.expires)))
            .catch(e => reject(e));
        });
    }

    downloadFile(fileId, machineId)
    {
        return new Promise((resolve, reject) => 
        {
            this.body = 
            { 
                "adblockDetected": false,
                "noAdsWithCoins": false,
                "fileId": fileId,
                "qrData": 
                {
                    "qrUrl": "",
                    "qrTitle": "",
                    "qrDescription": ""
                },
                "machineId": machineId,
                "referralCode": "",
                "ads": 
                [
                    {
                        "lineItemId": 1,
                        "ubication": 33,
                        "files": 
                        {
                            "imgUrl": ""
                        },
                        "viewUrl": "",
                        "clickUrl": "",
                        "urlPixel": "",
                        "creativeId": 1,
                        "orderId": 3358957,
                        "sponsored": 1
                    },
                ],
                "ubication17ExpectedPubs": 0,
                "ubication1ExpectedPubs": 1,
                "ubication2ExpectedPubs": 1,
                "ubication3ExpectedPubs": 4,
                "ubication17RequestedPubs": 0,
                "ubication1RequestedPubs": 1,
                "ubication2RequestedPubs": 1,
                "ubication3RequestedPubs": 4
            };
    
            this.headers = JSON.stringify
            ({
                method: "POST",
                mode: "cors",
                headers: 
                {
                   "Content-Type": "application/json",
                    "Content-length": this.body.length
                },
                body: JSON.stringify(this.body)
            });
            this.path = "/v2/download";

            fetch(this.url +  this.path, this.headers)
            .then(res => res.json().then(json => resolve(json.url)))
            .catch(e => reject(e));
        });
    }
}

export function isUserLoged()
{
    let tokenExpire = getEncryptedCookie("expire");
    let tokenDate = new Date(tokenExpire);
    
    return (new Date()) < tokenDate;
}