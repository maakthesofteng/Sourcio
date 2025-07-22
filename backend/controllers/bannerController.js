const formidable = require("formidable");
const productModel = require("../models/productModel");
const cloudinary = require("cloudinary").v2;
const { responseReturn } = require("../utils/response");
const bannerModel = require("../models/bannerModel");
const { mongo: { ObjectId } } = require("mongoose");
// const mongoose = require("mongoose");

class bannerController {
  add_banner = async (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable parse error:", err);
        return responseReturn(res, 400, { message: "Error parsing form data" });
      }

      console.log("Parsed fields:", fields);
      console.log("Parsed files:", files);

      const { productId } = fields;
      const { image } = files;
      const file = Array.isArray(image) ? image[0] : image;

      if (!file || !file.filepath) {
        return responseReturn(res, 400, {
          message: "Missing required parameter - file"
        });
      }

      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true
      });

      try {
        const { slug } = await productModel.findById(productId);
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "banners"
        });

        const banner = await bannerModel.create({
          productId,
          banner: result.url,
          link: slug
        });

        responseReturn(res, 201, { banner, message: "banner add success" });
      } catch (error) {
        console.log("Cloudinary upload error:", error);
        responseReturn(res, 500, { message: error.message });
      }
    });
  };

    get_banner = async (req, res) => {
      const { productId } = req.params
      try {
          const banner = await bannerModel.findOne({ productId: new ObjectId(productId) })
          responseReturn(res, 200, { banner })
      } catch (error) {
          console.log(error)
          responseReturn(res, 500, { message: error.message })
      }
    };

  get_banners = async (req, res) => {
    try {
        const banners = await bannerModel.aggregate([
            {
                $sample: {
                    size: 10
                }
            }
        ])
        responseReturn(res, 200, { banners })
    } catch (error) {
        console.log(error)
        responseReturn(res, 500, { message: error.message })
    }
  };

 update_banner = async (req, res) => {
  const { bannerId } = req.params;

  const form = new formidable.IncomingForm(); // ✅ FIXED

  form.parse(req, async (err, _, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return responseReturn(res, 400, { message: "Form parsing failed" });
    }

    const { image } = files;
    const file = Array.isArray(image) ? image[0] : image;

    if (!file || !file.filepath) {
      return responseReturn(res, 400, { message: "No file provided" });
    }

    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
      secure: true,
    });

    try {
      let banner = await bannerModel.findById(bannerId);

      if (!banner) {
        return responseReturn(res, 404, { message: "Banner not found" });
      }

      // 🔥 Extract public ID from URL for deletion
      const segments = banner.banner.split("/");
      const lastSegment = segments[segments.length - 1];
      const imageName = lastSegment.split(".")[0];

      await cloudinary.uploader.destroy(`banners/${imageName}`);

      const { url } = await cloudinary.uploader.upload(file.filepath, {
        folder: "banners",
      });

      await bannerModel.findByIdAndUpdate(bannerId, {
        banner: url,
      });

      banner = await bannerModel.findById(bannerId);

      responseReturn(res, 200, { banner, message: "Banner update success" });
    } catch (error) {
      console.error("Update error:", error);
      responseReturn(res, 500, { message: error.message });
    }
  });
};


}

module.exports = new bannerController();
