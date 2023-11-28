const forge = require("node-forge");
const modal = require("../models");

const key = forge.random.getBytesSync(16);
const iv = forge.random.getBytesSync(16);

// const addUser = async (req, res) => {
//   try {
//     const { email, password } = await req.body;
//     if (email && password) {
//       const user = await modal.NewUsers.findOne({ where: { email } });
//       if (user) {
//         const token = jwt.sign({ email }, 'secret-key', { expiresIn: '1h' });
//         const name = user.name;
//         return res.json({ token, name, user });
//       } else {
//         return res.status(400).json({ msg: 'INVALID_EMAIL' });
//       }
//     } else {
//       return res.status(400).json({ msg: 'EMPTY' });
//     }
//   } catch (err) {
//     return res.status(400).json(err);
//   }
// };

const addData = async (req, res) => {
  try {
    const { firstName, lastName, email, gender, image } = await req.body;
    if (firstName && lastName && email && gender && image) {
      try {
        const firstNameCipher = forge.cipher.createCipher("AES-CBC", key);
        firstNameCipher.start({ iv });
        firstNameCipher.update(forge.util.createBuffer(firstName, "utf8"));
        firstNameCipher.finish();
        const encryptedFirstName = firstNameCipher.output.toHex();

        const lastNameCipher = forge.cipher.createCipher("AES-CBC", key);
        lastNameCipher.start({ iv });
        lastNameCipher.update(forge.util.createBuffer(lastName, "utf8"));
        lastNameCipher.finish();
        const encryptedLastName = lastNameCipher.output.toHex();

        const emailCipher = forge.cipher.createCipher("AES-CBC", key);
        emailCipher.start({ iv });
        emailCipher.update(forge.util.createBuffer(email, "utf8"));
        emailCipher.finish();
        const encryptedEmail = emailCipher.output.toHex();

        const genderCipher = forge.cipher.createCipher("AES-CBC", key);
        genderCipher.start({ iv });
        genderCipher.update(forge.util.createBuffer(gender, "utf8"));
        genderCipher.finish();
        const encryptedGender = genderCipher.output.toHex();

        const user = await modal.User.create({
            firstName :encryptedFirstName, 
            lastName: encryptedLastName, 
            email: encryptedEmail, 
            gender: encryptedGender, 
            image
        });
        return res.status(201).json({ user });
      } catch (err) {
        console.log("err adding data from form: ", err);
        return res.status(400).json(err);
      }
    } else {
      return res.status(406).json({
        msg: "First Name or Last Name or Email or Gender or Image is empty",
      });
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

// const getUser = async (req, res) => {
//   try {
//     const { name } = req.query;
//     const user = await modal.NewUsers.findOne({ where: { name } });
//     if (user) {
//       return res.json({ name });
//     }
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// };

// const verifyHash = async (req, res) => {
//   try {
//     const { hash, myPassword } = await req.body;
//     const match = await argon2.verify(hash, myPassword);
//     if (match) {
//       return res.status(200).json({ msg: 'SUCCESSFUL' });
//     } else {
//       return res.status(400).json({ msg: 'UNSUCCESSFUL' });
//     }
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// };

const verifyHashForge = async (req, res) => {
  try {
    const { hash, myPassword } = await req.body;
    const decipher = forge.cipher.createDecipher("AES-CBC", key);
    decipher.start({ iv });
    decipher.update(forge.util.createBuffer(hash));
    decipher.finish();
    const password = decipher.output.toString("utf8");
    if (password === myPassword) {
      return res.status(200).json({ msg: "SUCCESSFUL", password });
    } else {
      return res.status(400).json({ msg: "UNSUCCESSFUL" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  addData,
  verifyHashForge,
};
