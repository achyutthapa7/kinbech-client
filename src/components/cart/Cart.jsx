import React, { useEffect, useState } from "react";
import { useUser } from "../../context/User";
import { useCart } from "../../context/Cartcontext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
  const [Cart, dispatch] = useCart();

  const [loading, setLoading] = useState(false);
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: Cart,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const [userInfo, setUserInfo] = useUser();
  const navigate = useNavigate();
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (
      userInfo.mode === "Selling" ||
      !userInfo.userDetails ||
      !userInfo.token
    ) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);

  const calculateTotal = () => {
    return Cart.reduce((total, item) => total + item.itemPriceAfterDiscount, 0);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-auto flex flex-col md:flex-row">
      <div className="flex-1 md:mr-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
        {Cart.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Cart.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={item.itemImage[0]}
                  alt={item.itemName}
                  className="h-40 object-cover w-full"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 truncate">
                    {item.itemName}
                  </h2>
                  <p className="text-gray-800 font-bold mb-2">
                    Rs. {item.itemPriceAfterDiscount}
                  </p>
                  {item.anyDiscount > 0 && (
                    <p className="text-red-600 mb-2">
                      <span className="line-through text-gray-500">
                        Rs. {item.itemPrice}
                      </span>{" "}
                      -{item.anyDiscount}%
                    </p>
                  )}
                  <p className="text-gray-600 mb-4 truncate">{item.itemDesc}</p>
                  <p className="text-gray-600 mb-4 truncate">
                    category: {item.itemCategory}
                  </p>
                  <div className="flex gap-5">
                    <div className="flex-1">
                      {" "}
                      <button
                        disabled={removing}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full"
                        onClick={() => {
                          setRemoving(true);
                          dispatch({
                            type: "REMOVE_FROM_CART",
                            payload: item._id,
                          });
                          toast("Removed from the Cart");
                          setRemoving(false);
                        }}
                      >
                        {removing
                          ? "Removing from Cart...."
                          : "Remove from Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Your cart is empty.</p>
        )}
      </div>
      <div className="w-full md:w-1/3 lg:w-1/4 mt-6 md:mt-0">
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Total: Rs. {calculateTotal()}
          </h2>
          {calculateTotal() > 0 && (
            <button
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full active:bg-blue-400"
              onClick={handleCheckout}
            >
              {loading ? "loading..." : "Continue to Payment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
