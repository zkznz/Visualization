const fs = require('fs');
exports.getFileJsonData = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err)
                return reject(err);
            else
                return resolve(data);
        })
    })

}