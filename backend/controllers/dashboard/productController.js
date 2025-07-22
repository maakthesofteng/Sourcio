const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const productModel = require("../../models/productModel");
const { responseReturn } = require("../../utils/response");
const fs = require("fs"); // Import File System module

class productController {

  add_product = async (req, res) => {
    const { id } = req;
    const form = new formidable.IncomingForm(); 
    form.multiples = true; 

    form.parse(req, async (err, field, files) => {
      if (err) {
        return responseReturn(res, 400, { error: "Form parsing error" });
      }

      let {
        name,
        category,
        description,
        stock,
        price,
        discount,
        shopName,
        brand
      } = field; 

      const { images } = files;

      name = String(name).trim();
      category = String(category).trim();
      description = String(description).trim();
      shopName = String(shopName).trim();
      brand = String(brand).trim();

      const slug = name.split(" ").join("-");


      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true
      });

      try {
        let allImageUrl = [];

        if (images && Array.isArray(images)) {
          for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i].filepath, {
              folder: "products"
            });
            allImageUrl.push(result.url);
          }
        } else if (images) {
          // If only one image is uploaded
          const result = await cloudinary.uploader.upload(images.filepath, {
            folder: "products"
          });
          allImageUrl.push(result.url);
        }

        await productModel.create({
          sellerId: id,
          name,
          slug,
          shopName,
          category,
          description,
          stock: parseInt(stock) || 0,
          price: parseFloat(price) || 0,
          discount: parseInt(discount) || 0,
          images: allImageUrl,
          brand
        });

        responseReturn(res, 201, { message: "Product added successfully" });
      } catch (error) {
        console.error(error);
        responseReturn(res, 500, { error: error.message });
      }
    });
  };


  products_get = async (req, res) => {
    const { page, searchValue, parPage } = req.query
    const { id } = req;

    const skipPage = parseInt(parPage) * (parseInt(page) - 1);

    try {
        if (searchValue) {
            const products = await productModel.find({
                $text: { $search: searchValue },
                sellerId: id
            }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
            const totalProduct = await productModel.find({
                $text: { $search: searchValue },
                sellerId: id
            }).countDocuments()
            responseReturn(res, 200, { totalProduct, products })
        } else {
            const products = await productModel.find({ sellerId: id }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
            const totalProduct = await productModel.find({ sellerId: id }).countDocuments()
            responseReturn(res, 200, { totalProduct, products })
        }
    } catch (error) {
        console.log(error.message)
    }
}

product_get = async (req, res) => {
    const { productId } = req.params;
    console.log(productId)
    try {
        const product = await productModel.findById(productId)
        responseReturn(res, 200, { product })
    } catch (error) {
        console.log(error.message)
    }
}

  product_update = async (req, res) => {
    let {
      name,
      description,
      discount,
      price,
      brand,
      productId,
      stock
    } = req.body;
    name = name.trim();
    // name = name.replace(/[^a-zA-Z0-9\s-]/g, "");
    const slug = name.split(" ").join("-");

    try {
      await productModel.findByIdAndUpdate(productId, {
        name,
        description,
        discount,
        price,
        brand,
        productId,
        stock,
        slug
      });
      const product = await productModel.findById(productId);
      responseReturn(res, 200, { product, message: "product update success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };


  product_image_update = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.multiples = false;
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return responseReturn(res, 400, { error: "Form parsing error: " + err.message });
        }

        console.log("Fields:", fields);
        console.log("Files:", files);

        // Extract values properly
        const productId = fields.productId ? fields.productId[0] : null;
        const oldImage = fields.oldImage ? fields.oldImage[0] : null;
        const newImageFile = files.newImage && Array.isArray(files.newImage) ? files.newImage[0] : files.newImage;

        if (!productId || !oldImage || !newImageFile || !newImageFile.filepath) {
            return responseReturn(res, 400, { error: "Missing productId, oldImage, or newImage" });
        }

        try {
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            console.log("Uploading file:", newImageFile.filepath);

            // Upload the extracted file
            const result = await cloudinary.uploader.upload(newImageFile.filepath, { folder: "products" });

            if (!result.secure_url) {
                return responseReturn(res, 400, { error: "Image upload failed" });
            }

            let product = await productModel.findById(productId);
            if (!product) {
                return responseReturn(res, 404, { error: "Product not found" });
            }

            const index = product.images.findIndex(img => img === oldImage);
            if (index !== -1) {
                product.images[index] = result.secure_url;
                await product.save();
            } else {
                return responseReturn(res, 400, { error: "Old image not found in product" });
            }

            return responseReturn(res, 200, { product, message: "Product image updated successfully" });
        } catch (error) {
            console.error("Error updating product image:", error);
            return responseReturn(res, 500, { error: error.message });
        }
    });
};




}

module.exports = new productController();
