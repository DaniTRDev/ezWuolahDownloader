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

    login(email, password)
    {
        return new Promise((resolve, reject) => 
        {
            if (email === "" || password === "")
                return reject("Invalid password or username!");

            this.body = JSON.stringify
            ({ 
                "account": email, 
                "password": password 
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
                body: this.body
            }
            this.path = "login";
            fetch(this.url + this.path, this.headers)
            .then(res => res.json())
            .then(json => resolve(json))
            .catch(e => reject(e));
        });
    }

    getUploadMeta(uploadId)
    {
        return new Promise((resolve, reject) => 
        {
            if (uploadId === undefined)
                reject("Given uploadId is not valid"); 

            this.headers =
            {
                method: "GET",
                mode: "cors",
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getEncryptedCookie("token")
                }
            }
            this.path = "/v2/uploads/" + uploadId.toString();
            fetch(this.url + this.path, this.headers)
                .then(res => res.json())
                .then(json => resolve(json))
                .catch(e => reject(e));
        });
    }

    getDocumentMeta(documentId)
    {
        return new Promise((resolve, reject) =>
        {
            if (documentId === undefined)
                reject("Given uploadId is not valid");

            this.headers =
            {
                method: "GET",
                mode: "cors",
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getEncryptedCookie("token")
                }
            }
            this.path = "/v2/documents?sort=-createdAt&filter[uploadId]=" + documentId.toString();
            fetch(this.url + this.path, this.headers)
                .then(res => res.json())
                .then(json => resolve(json))
                .catch(e => reject(e));
        });
    }

    downloadFile(fileId, machineId)
    {
        return new Promise((resolve, reject) => 
        {
            if (fileId === undefined || machineId === undefined)
                reject("Given fileID or machineId was not valid");

            this.body = JSON.stringify
            ({ 
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
                "ads": [], //having this array empty makes wuolah embed its own ads into the .pdf
                "ubication17ExpectedPubs": 0,
                "ubication1ExpectedPubs": 0,
                "ubication2ExpectedPubs": 0,
                "ubication3ExpectedPubs": 0,
                "ubication17RequestedPubs": 0,
                "ubication1RequestedPubs": 0,
                "ubication2RequestedPubs": 0,
                "ubication3RequestedPubs": 0
            });

            this.headers = 
            {
                method: "POST",
                mode: "cors",
                headers:
                {
                    "Content-Type": "application/json",
                    "Content-length": this.body.length,
                    "Authorization": "Bearer " + getEncryptedCookie("token")
                },
                body: this.body
            };
            this.path = "v2/download";
            fetch(this.url + this.path, this.headers)
            .then(res => res.json())
            .then(json => resolve(json))
            .catch(e => reject(e));
        });
    }

    downloadFolder(folderId)
    {
        return new Promise((resolve, reject) =>
        {
            if (folderId === undefined)
                reject("Given folderId was not valid");

            //get meta data of the folder itself
            this.getUploadMeta(folderId)
            .then(folderMeta =>
            {
                if (!folderMeta.isFolder || folderMeta.numFiles == 0)
                    reject("Upload is not a folder");

                //get meta data of the documents inside the folder
                this.getDocumentMeta(folderId)
                .then((documentsMeta) =>
                {
                    let fileIds = [];
                    for (let i = 0; i < folderMeta.numFiles; i++)
                        fileIds.push(documentsMeta.data[i].id);

                    resolve({ numFiles: folderMeta.numFiles, fileIds: fileIds });
                })
                .catch(e => reject("Invalid folder elements metadata : " + e));
            })
            .catch(e => reject("Could not download folder: " + e));
        });
    }
}

export function isUserLoged()
{
    return getEncryptedCookie("token") != "";
}