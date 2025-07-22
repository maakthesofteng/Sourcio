const adminModel = require("../models/adminModel");
const sellerModel = require("../models/sellerModel");
const sellerCustomerModel = require("../models/chat/sellerCustomerModel");
const { responseReturn } = require("../utils/response");
const { createToken } = require("../utils/tokenCreate");
const bcrpty = require("bcrypt");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
// const jwt = require("jsonwebtoken");

class authControllers {
  admin_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      if (admin) {
        const match = await bcrpty.compare(password, admin.password);
        if (match) {
          const token = await createToken({
            id: admin.id,
            role: admin.role
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          });
          responseReturn(res, 200, { token, message: "Login success" });
        } else {
          responseReturn(res, 404, { error: "Password Error" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  seller_register = async (req, res) => {
    const { email, name, password } = req.body;
    try {
      const getUser = await sellerModel.findOne({ email });
      if (getUser) {
        responseReturn(res, 404, { error: "Email alrady exit" });
      } else {
        const seller = await sellerModel.create({
          name,
          email,
          password: await bcrpty.hash(password, 10),
          method: "menualy",
          shopInfo: {}
        });
        await sellerCustomerModel.create({
          myId: seller.id
        });
        const token = await createToken({ id: seller.id, role: seller.role });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        responseReturn(res, 201, { token, message: "register success" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  seller_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const seller = await sellerModel.findOne({ email }).select("+password");
      if (seller) {
        const match = await bcrpty.compare(password, seller.password);
        if (match) {
          const token = await createToken({
            id: seller.id,
            role: seller.role
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          });
          responseReturn(res, 200, { token, message: "Login success" });
        } else {
          responseReturn(res, 404, { error: "Password wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  profile_image_upload = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log("Form parsing error:", err);
        return responseReturn(res, 400, { error: "Form parsing failed" });
      }

      // console.log("Uploaded files:", files);
      // console.log("Received fields:", fields);

      // Extract `userId` properly
      const userId = Array.isArray(fields.userId)
        ? fields.userId[0]
        : fields.userId;

      if (!userId) {
        return responseReturn(res, 400, { error: "User ID is required" });
      }

      const fileKey = Object.keys(files)[0];
      if (!fileKey || !files[fileKey]) {
        return responseReturn(res, 400, { error: "No image file provided." });
      }

      const imageFile = Array.isArray(files[fileKey])
        ? files[fileKey][0]
        : files[fileKey];

      // Cloudinary Configuration Inside the Function
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true
      });

      try {
        const result = await cloudinary.uploader.upload(imageFile.filepath, {
          folder: "profile"
        });

        if (!result) {
          return responseReturn(res, 404, { error: "Image upload failed" });
        }

        await sellerModel.findByIdAndUpdate(userId, { image: result.url });

        const userInfo = await sellerModel.findById(userId);
        return responseReturn(res, 201, {
          message: "Image upload success",
          userInfo
        });
      } catch (error) {
        // console.log("Cloudinary upload error:", error);
        return responseReturn(res, 500, { error: error.message });
      }
    });
  };

  profile_info_add = async (req, res) => {
    const { division, district, shopName, sub_district } = req.body;
    const { id } = req;

    try {
      await sellerModel.findByIdAndUpdate(id, {
        shopInfo: {
          shopName,
          division,
          district,
          sub_district
        }
      });
      const userInfo = await sellerModel.findById(id);
      responseReturn(res, 201, {
        message: "Profile info add success",
        userInfo
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  getUser = async (req, res) => {
    const { id, role } = req;

    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
      } else {
        const seller = await sellerModel.findById(id);
        responseReturn(res, 200, { userInfo: seller });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  logout = async (req, res) => {
    // console.log(res)
        try {
            res.cookie('accessToken',null,{
                expires : new Date(Date.now()),
                httpOnly : true
            })
            responseReturn(res,200,{message : 'logout success'})
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
}
module.exports = new authControllers();

// const sellerModel = require('../models/sellerModel')
// const sellerCustomerModel = require('../models/chat/sellerCustomerModel')

// const { createToken } = require('../utiles/tokenCreate')
// class authControllers {

//     profile_image_upload = async (req, res) => {
//         const { id } = req
//         const form = formidable({ multiples: true })
//         form.parse(req, async (err, _, files) => {
//             cloudinary.config({
//                 cloud_name: process.env.cloud_name,
//                 api_key: process.env.api_key,
//                 api_secret: process.env.api_secret,
//                 secure: true
//             })
//             const { image } = files
//             try {
//                 const result = await cloudinary.uploader.upload(image.filepath, { folder: 'profile' })
//                 if (result) {
//                     await sellerModel.findByIdAndUpdate(id, {
//                         image: result.url
//                     })
//                     const userInfo = await sellerModel.findById(id)
//                     responseReturn(res, 201, { message: 'image upload success', userInfo })
//                 } else {
//                     responseReturn(res, 404, { error: 'image upload failed' })
//                 }
//             } catch (error) {
//                 //console.log(error)
//                 responseReturn(res, 500, { error: error.message })
//             }
//         })
//     }

//     
// }
// module.exports = new authControllers()
