import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";

const Updateproduct = () => {
  const location = useLocation();
  const product = location.state?.product;
  const imgref = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemName: product?.itemName || "",
    itemDesc: product?.itemDesc || "",
    itemPrice: product?.itemPrice || "",
    anyDiscount: product?.anyDiscount || "",
    itemPriceAfterDiscount: product?.itemPriceAfterDiscount || "",
    itemCategory: product?.itemCategory || "",
    itemImage: product?.itemImage || [],
  });
  const [errors, setErrors] = useState({});
  const {
    itemName,
    itemDesc,
    itemPrice,
    anyDiscount,
    itemPriceAfterDiscount,
    itemCategory,
  } = formData;

  useEffect(() => {
    const priceAfterDiscount = itemPrice - (anyDiscount / 100) * itemPrice;
    setFormData({ ...formData, itemPriceAfterDiscount: priceAfterDiscount });
  }, [itemPrice, anyDiscount]);

  const [imgSrc, setImgSrc] = useState(
    product?.itemImage.map((img) => ({ file: null, url: img })) || []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImgSrc([...imgSrc, ...newImages]);
  };

  const removeProduct = (i) => {
    const newImgSrc = imgSrc.filter((_, index) => index !== i);
    setImgSrc(newImgSrc);
  };

  const validate = () => {
    let errors = {};
    if (!itemName) errors.itemName = "Product name is required";
    if (!itemDesc) errors.itemDesc = "Product description is required";
    if (!itemPrice) errors.itemPrice = "Price is required";
    if (!itemCategory) errors.itemCategory = "Category is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    updateProduct();
  };

  const updateProduct = async () => {
    const data = new FormData();
    imgSrc.forEach((img) => {
      if (img.file) {
        data.append("image", img.file);
      }
    });
    try {
      let result;
      if (data.has("image")) {
        const res = await fetch(`${import.meta.env.VITE_PRODUCTION_URL}/addimage`, {
          method: "POST",
          body: data,
          credentials: "include",
        });
        if (res.status === 400) {
          toast.error("At least one image is required");
        }
        if (res.status === 200) {
          result = await res.json();
          const updatedImages =
            result.fileUrls.length > 0 ? result.fileUrls : formData.itemImage;
        }
      } else {
        result = { fileUrls: [] };
      }

      const response = await fetch(`${import.meta.env.VITE_PRODUCTION_URL}/updateproduct`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          itemName,
          itemDesc,
          itemPrice,
          anyDiscount,
          itemPriceAfterDiscount,
          itemCategory,
          itemImage:
            result.fileUrls.length > 0
              ? [...formData.itemImage, ...result.fileUrls]
              : formData.itemImage,
          id: product._id,
        }),
        credentials: "include",
      });

      if (response.status === 200) {
        setFormData({
          itemName: "",
          itemDesc: "",
          itemPrice: "",
          anyDiscount: "",
          itemPriceAfterDiscount: "",
          itemCategory: "",
        });
        setImgSrc([]);
        toast.success("Product updated successfully");
      } else {
        toast.error("Internal server error");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">Update Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          name="itemName"
          placeholder="Product name *"
          value={itemName}
          onChange={handleInputChange}
          className="border p-2 mb-1 w-full"
        />
        {errors.itemName && (
          <p className="text-red-500 text-sm mb-3">{errors.itemName}</p>
        )}
        <textarea
          type="text"
          name="itemDesc"
          placeholder="Product description *"
          value={itemDesc}
          onChange={handleInputChange}
          className="border p-2 mb-1 w-full"
        />
        {errors.itemDesc && (
          <p className="text-red-500 text-sm mb-3">{errors.itemDesc}</p>
        )}
        <input
          type="number"
          name="itemPrice"
          placeholder="Price *"
          value={itemPrice}
          onChange={handleInputChange}
          className="border p-2 mb-1 w-full"
        />
        {errors.itemPrice && (
          <p className="text-red-500 text-sm mb-3">{errors.itemPrice}</p>
        )}
        <input
          type="number"
          name="anyDiscount"
          placeholder="Discount (%)"
          value={anyDiscount}
          onChange={handleInputChange}
          className="border p-2 mb-3 w-full"
        />
        <input
          type="number"
          name="itemPriceAfterDiscount"
          placeholder="Price after discount"
          value={itemPriceAfterDiscount}
          onChange={handleInputChange}
          className="border p-2 mb-3 w-full"
        />
        <select
          name="itemCategory"
          value={itemCategory}
          onChange={handleInputChange}
          className="border p-2 mb-5 w-full"
        >
          <option value="">Select Category</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Jewelry">Jewelry</option>
        </select>
        {errors.itemCategory && (
          <p className="text-red-500 text-sm mb-3">{errors.itemCategory}</p>
        )}
        <input
          type="file"
          id="file"
          className="hidden"
          onChange={handleImage}
          ref={imgref}
        />
        <div className="flex gap-5">
          <div className="flex gap-5">
            {imgSrc.length <= 5 &&
              imgSrc.map((img, i) => (
                <div className="relative" key={i}>
                  <a href={img.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={img.url}
                      alt="img"
                      className="w-[100px] h-[100px] object-cover"
                    />
                  </a>

                  <p
                    className="absolute -top-2 -right-2 bg-red-900 text-white rounded-full h-5 w-5 text-center flex items-center justify-center cursor-pointer"
                    onClick={() => removeProduct(i)}
                  >
                    X
                  </p>
                </div>
              ))}
          </div>
          {imgSrc.length < 5 && (
            <label htmlFor="file" className="tooltip-container">
              <div className="w-[100px] h-[100px] border-2 border-slate-400 inline-flex cursor-pointer items-center justify-center">
                <AiOutlinePlus size={24} />
              </div>
              <span className="tooltip-text">Add images</span>
            </label>
          )}
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded-md flex justify-center items-center mt-5"
        >
          {isLoading ? "Updating..." : "Update product"}
        </button>
      </form>

      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }

        .tooltip-container:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }

        .tooltip-text {
          visibility: hidden;
          width: 80px;
          background-color: black;
          color: #fff;
          text-align: center;
          border-radius: 5px;
          padding: 5px 0;
          position: absolute;
          z-index: 1;
          bottom: 125%; /* Position above the icon */
          left: 50%;
          margin-left: -40px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .tooltip-text::after {
          content: "";
          position: absolute;
          top: 100%; /* At the bottom of the tooltip */
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: black transparent transparent transparent;
        }
      `}</style>
    </>
  );
};

export default Updateproduct;
