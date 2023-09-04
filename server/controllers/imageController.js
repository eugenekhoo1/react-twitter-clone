const {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} = require("firebase/storage");
const storage = require("../config/firebase");
const { v4 } = require("uuid");
const { query } = require("../config/db");

async function avatarUpload(req, res) {
  try {
    const { user } = req.body;

    const avatarRef = ref(storage, `avatar/${v4() + req.file.originalname}`);
    const uploadAvatar = await uploadBytesResumable(avatarRef, req.file.buffer);
    const downloadURL = await getDownloadURL(uploadAvatar.ref);

    const response = await query(
      "UPDATE users SET avatar=$1 WHERE username=$2",
      [downloadURL, user]
    );
    return res.send({
      message: `file uploaded to firebase`,
      name: req.file.originalname,
      type: req.file.mimetype,
      downloadURL: downloadURL,
    });
  } catch (err) {
    console.error(err);
  }
}

module.exports = avatarUpload;
