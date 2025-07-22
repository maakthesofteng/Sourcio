const categoryModel = require("../../models/categoryModel");
const { responseReturn } = require("../../utils/response");
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");


class categoryController {
  add_category = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        // console.log("Formidable Parse Error:", err);
        return responseReturn(res, 400, { error: "Something went wrong while parsing the form" });
      }

      // console.log("Fields:", fields);
      // console.log("Files:", files);

      let { name } = fields;
      let { image } = files;

      // Ensure name is properly formatted
      name = Array.isArray(name) ? name[0].trim() : name?.trim() || "";
      const slug = name.split(" ").join("-");

      // Check if the image exists
      if (!image || !image[0] || !image[0].filepath) {
        // console.log("Image Not Found in Form Data");
        return responseReturn(res, 400, { error: "Image is required" });
      }

      const imagePath = image[0].filepath;  

      try {
        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true
        });

        const result = await cloudinary.uploader.upload(imagePath, { folder: "categorys" });

        if (result) {
          const category = await categoryModel.create({
            name,
            slug,
            image: result.url
          });
          return responseReturn(res, 201, { category, message: "Category Added Successfully" });
        } else {
          return responseReturn(res, 404, { error: "Image upload failed" });
        }
      } catch (error) {
        // console.error("Cloudinary Upload Error:", error);
        return responseReturn(res, 500, { error: "Internal Server Error" });
      }
    });
 }


  get_category = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    try {
      let skipPage = "";
      if (parPage && page) {
        skipPage = parseInt(parPage) * (parseInt(page) - 1);
      }
      if (searchValue && page && parPage) {
        const categorys = await categoryModel
          .find({ $text: { $search: searchValue } })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel
          .find({ $text: { $search: searchValue } })
          .countDocuments();
        responseReturn(res, 200, { totalCategory, categorys });
      } else if (searchValue === "" && page && parPage) {
        const categorys = await categoryModel
          .find({})
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { totalCategory, categorys });
      } else {
        const categorys = await categoryModel.find({}).sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { totalCategory, categorys });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
}

module.exports = new categoryController();
