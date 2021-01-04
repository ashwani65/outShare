const File = require('./models/file');
const fs = require('fs');
const connectDB = require('./config/db');
connectDB();

const deleteData = async () => {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  // 24 hours old files fetch and delete them
  const files = await File.find({
    createdAt: { $lt: pastDate },
  });

  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`successfully delete ${file.filename}`);
      } catch (err) {
        console.log(`Error while deleting file ${err}`);
      }
    }
    console.log('Job Done!');
  }
};

deleteData().then(process.exit());
