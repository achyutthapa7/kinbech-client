import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("http://localhost:3000/fetchProduct", {
          method: "GET",
          credentials: "include",
        });
        if (res.status === 404) {
          const data = await res.json();
          toast.error(data.message);
        }
        if (res.status === 200) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProduct();
  }, [products, setProducts]);

  const removeProduct = async (id) => {
    console.log(id);
    try {
      const res = await fetch("http://localhost:3000/removeproduct", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ id }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 404) toast("Product not found");
      if (res.status === 200) {
        toast("Product removed successfully");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdateClick = (product) => {
    navigate("updateproduct", { state: { product } });
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <p className="text-3xl font-bold text-center mb-6">All Products</p>

      <div className="">
        {products &&
          products.map((product, i) => (
            <div
              key={i}
              className="p-4 rounded-lg flex gap-10 flex-wrap justify-center"
            >
              {product.productDetails.length > 0 ? (
                <>
                  {product.productDetails.map((p) => (
                    <div
                      key={p.itemName}
                      className="mb-4 bg-white shadow-lg p-5 rounded-lg "
                    >
                      <img
                        src={p.itemImage[0]}
                        alt={p.itemName}
                        className="w-full h-40 object-cover rounded-md mb-2"
                      />
                      <h2 className="text-xl font-semibold mb-1">
                        {p.itemName}
                      </h2>
                      <p className="text-gray-600 mb-2">{p.itemDesc}</p>
                      <p className="text-lg font-bold text-green-600 mb-4">
                        ${p.itemPrice}
                      </p>
                      <div className="flex justify-between">
                        <button
                          onClick={() => {
                            handleUpdateClick(p);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Update
                        </button>

                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          onClick={() => removeProduct(p._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-center text-gray-500">
                  No products available.
                </p>
              )}
            </div>
          ))}
      </div>
      <Outlet />
    </div>
  );
};

export default AllProduct;
