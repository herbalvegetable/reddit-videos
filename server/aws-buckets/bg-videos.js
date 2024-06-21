const S3 = require('aws-sdk/clients/s3');
require('dotenv').config();

const bucket = {
    name: process.env.AWS_BGVIDEOS_BUCKET_NAME,
    instance: new S3({
        region: process.env.AWS_BGVIDEOS_BUCKET_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }),
}

function getFile(fileKey) {
    const params = {
        Key: fileKey,
        Bucket: bucket.name,
    }

    return bucket.instance.getObject(params).createReadStream();
}

module.exports = { getFile }