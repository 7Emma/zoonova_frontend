import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://votre-site.com/order/complete",
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement /> {/* <== Le champ complet */}
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Payer
      </button>
    </form>
  );
}
