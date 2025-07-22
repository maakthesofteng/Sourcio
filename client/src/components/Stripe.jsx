import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import axios from "axios";
import { useState } from "react";
import CheckoutForm from "./CheckoutForm";
// import { stripe_sky } from "../utils/config";
// import { api_url } from "../utils/config";
// const stripePromise = loadStripe(stripe_sky);
// const stripePromise = loadStripe(
//   "sk_test_51Ql549P4bRH1g8X5Z20shHla6Gn5QRJBWzSDvQzexcrftD1NrE5LurrtCiovViYjUwuKAgDTUvEt5H7zebgwk0RA007lOmpN5f"
// );
const stripePromise = loadStripe(
  "pk_test_51Ql549P4bRH1g8X5h304Tto0XUR74uIlVGIhiH7kTxn0L4mciIhFF7XfvUdur9sRTd9UDvj43Ft80Wrwf0oCHTmE00MKSm41f7"
);

const Stripe = ({ price, orderId }) => {
  const [clientSecret, setClientSecret] = useState("");
  const apperance = {
    theme: "stripe"
  };

  const options = {
    apperance,
    clientSecret
  };

  const create_payment = async () => {
    try {
      // const { data } = await axios.post(
      //   `${api_url}/api/order/create-payment`,
      //   { price },
      //   { withCredentials: true }
      // );
      const { data } = await axios.post(
        `http://localhost:5000/api/order/create-payment`,
        { price },
        { withCredentials: true }
      );
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.log(error.response.data);
    }
  };
  return (
    <div className="py-8 px-4 bg-white">
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm orderId={orderId} />
        </Elements>
      ) : (
        <button
          onClick={create_payment}
          className="px-10 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-white"
        >
          Start Payment
        </button>
      )}
    </div>
  );
};

export default Stripe;
