const stripe = Stripe('pk_test_51I69ABBvUweAFj1LGJ81GeFgeBA82kEMUaJR5uEW6zsPRkFVTDoIx5DKsYYteYb9M5S2k7qOBNTja0Vc7InLlDpg000dexOfJO')
import axios from 'axios';
const showAlert = require("./alert");

export const bookTour =  async (tourId) => {
    // Get the checkout session
    try{
        const res = await axios.get(`/api/v1/booking/checkout-session/${tourId}`);

        await stripe.redirectToCheckout({
            sessionId: res.data.session.id
        })
    }catch(error){
        console.log(error);
        showAlert("error", error.message);
    }
}