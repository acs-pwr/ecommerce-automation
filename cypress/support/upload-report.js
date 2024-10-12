require('dotenv').config();
const path = require('path');
const Minio = require('minio');
const fs = require('fs').promises;
const sendNotification = require('./send-notification');

var minioClient = new Minio.Client({
    endPoint: process.env.URL_MINIO,
    port: parseInt(process.env.PORT_MINIO, 10),
    useSSL: true,
    accessKey: process.env.ACCESS_KEY_MINIO,
    secretKey: process.env.ACCESS_SECRET_MINIO,
    isPrivate: false,    
    bucket: process.env.BUCKET_NAME,
    storeio_directory: process.env.STOREIO_DIRECTORY
});

const bucket= process.env.BUCKET_NAME;
const storeio_directory= process.env.STOREIO_DIRECTORY;

// sendNotification();
var folderPath = './cypress/report';
var folderPathAssets = './cypress/report/assets';

async function uploadFiles() {
    try {
        const files = await fs.readdir(folderPath);

        for (const file of files) {
            var filePath = path.join(folderPath, file);
            var destinationObject = storeio_directory+"/"+ file;
            
            if (file === 'assets') {
                // const fileAssets = await fs.readdir(folderPathAssets);
                // for (const fileAsset of fileAssets) {
                //     var filePathAsset = path.join(folderPathAssets, fileAsset);
                //     var destinationObjectAssets = storeio_directory+"/assets/"+fileAsset;
                //     // Set the object metadata
                //     var metaData = {
                //         'Content-Type': 'html/text',
                //     };
                //     try {
                //         await minioClient.fPutObject(bucket, destinationObjectAssets, filePathAsset, metaData);
                //         console.log('File uploaded successfully: ' + fileAsset);
                //     } catch (err) {
                //         console.log('Error upload file: ' +err);
                //         console.log(fileAsset);
                //     }
                // }
                console.log('Skipping upload for: ' + file);
                continue; // Skip this iteration and move to the next file
            }
            // Set the object metadata
            var metaData = {
                'Content-Type': 'html/text',
            };

            try {
                await minioClient.fPutObject(bucket, destinationObject, filePath, metaData);
                console.log('File uploaded successfully: ' + file);

                var messageNotifUpload = 'Files uploaded successfully:\n \n' + bucket +'/'+ storeio_directory + '\n\n' + files.join('\n');
            } catch (err) {
                console.log('Error upload file: ' +err);
                console.log(file);
            }
        }
        sendNotification(messageNotifUpload);
    } catch (err) {
        console.log('Error read dir: ' +err);
    }
}
uploadFiles();