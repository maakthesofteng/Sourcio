import { useState } from "react";
import Headers from "../components/Header";
import Footer from "../components/Footer";
import Stripe from "../components/Stripe";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const {
    state: { price, items, orderId }
  } = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  return (
    <div>
      <Headers />
      <section className="bg-[#eeeeee]">
        <div className="max-w-[1440px] mx-auto px-16 sm:px-5 md-lg:px-12 md:px-10 py-16 mt-4">
          <div className="flex flex-wrap md:flex-col-reverse">
            <div className="w-7/12 md:w-full">
              <div className="pr-2 md:pr-0">
                <div className="flex flex-wrap">
                  <div
                    onClick={() => setPaymentMethod("stripe")}
                    className={`w-[20%] border-r cursor-pointer py-8 px-12 ${
                      paymentMethod === "stripe" ? "bg-white" : "bg-slate-100"
                    }`}
                  >
                    <div className="flex flex-col gap-[3px] justify-center items-center">
                      <img src="/images/payment/stripe.png" alt="stripe" />
                      <span className="text-slate-600">Stripe</span>
                    </div>
                  </div>
                </div>
                {paymentMethod === "stripe" && (
                  <div>
                    <Stripe orderId={orderId} price={price} />
                  </div>
                )}
              </div>
            </div>
            <div className="w-5/12 md:w-full">
              <div className="pl-2 md:pl-0 md:mb-0">
                <div className="bg-white shadow p-5 text-slate-600 flex flex-col gap-3">
                  <h2>Order Summary</h2>
                  <div className="flex justify-between items-center">
                    <span>{items} items and shipping fee included</span>
                    <span>Rs {price}</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Amount</span>
                    <span className="text-lg text-orange-500">Rs {price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Payment;
