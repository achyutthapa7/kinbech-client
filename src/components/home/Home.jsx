import React, { useEffect, useState } from "react";
import { useAllProducts } from "../../context/Product";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useUser } from "../../context/User";
import { useCart } from "../../context/Cartcontext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ImageModal = ({ isOpen, imgSrc, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-lg">
        <img
          src={imgSrc}
          alt="Product"
          className="object-cover w-full h-auto"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

const Home = ({ setModal = () => {} }) => {
  const navigate = useNavigate();
  const [allproducts] = useAllProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [userInfo, setUserInfo] = useUser();
  const [Cart, dispatch] = useCart();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  const addtocart = (product) => {
    if (!userInfo.userDetails || !userInfo.token) {
      setModal(true);
    } else {
      dispatch({ type: "ADD_TO_CART", payload: product });
      toast("Added to The Cart");
      setAdding(false);
    }
  };

  const removefromcart = (product) => {
    setRemoving(true);
    dispatch({ type: "REMOVE_FROM_CART", payload: product._id });
    toast("Removed from the Cart");
    setRemoving(false);
  };

  const isInCart = (productId) => {
    return Cart.some((item) => item._id === productId);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = allproducts
    .flat()
    .filter((product) =>
      selectedCategory
        ? product.productDetails.some(
            (pd) =>
              pd.itemCategory.toLowerCase() === selectedCategory.toLowerCase()
          )
        : true
    );

  return (
    <div className="p-6 bg-gray-100 min-h-auto">
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="clothing">Clothing</option>
          <option value="jewelry">Jewelry</option>
          <option value="electronics">Electronics</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <React.Fragment key={product._id}>
              {product.productDetails.map((pd) => (
                <div
                  className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                  key={pd._id}
                >
                  <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop
                    className="w-full"
                  >
                    {pd.itemImage.map((img, index) => (
                      <div key={index} className="relative">
                        <div
                          onClick={() => handleImageClick(img)}
                          className="cursor-pointer"
                        >
                          <img
                            src={img}
                            alt={pd.itemName}
                            className="h-40 object-cover w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </Carousel>
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 truncate">
                      {pd.itemName}
                    </h2>
                    <p className="text-gray-800 font-bold mb-2">
                      Rs. {pd.itemPriceAfterDiscount}
                    </p>
                    {pd.anyDiscount > 0 && (
                      <p className="text-red-600 mb-2">
                        <span className="line-through text-gray-500">
                          Rs. {pd.itemPrice}
                        </span>
                        -{pd.anyDiscount}%
                      </p>
                    )}
                    <p className="text-gray-600 mb-4 truncate">{pd.itemDesc}</p>
                    <p className="text-gray-600 mb-4 truncate">
                      category: {pd.itemCategory}
                    </p>
                    {(userInfo.mode != "Selling" ||
                      !userInfo.userDetails ||
                      !userInfo.token) && (
                      <div className="flex gap-5">
                        <div className="flex-1">
                          {isInCart(pd._id) ? (
                            <button
                              onClick={() => {
                                removefromcart(pd);
                              }}
                              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 w-full"
                            >
                              {removing
                                ? "Removing from Cart..."
                                : "Remove from Cart"}
                            </button>
                          ) : (
                            <button
                              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                              onClick={() => {
                                addtocart(pd);
                              }}
                            >
                              {adding ? "Adding to Cart..." : "Add to Cart"}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    <p className="text-gray-600 mt-2 text-sm">
                      Contact: {pd.emailAddress}
                    </p>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-600">
            No products found in this category.
          </p>
        )}
      </div>
      <ImageModal
        isOpen={isModalOpen}
        imgSrc={selectedImage}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Home;
