const { v4 } = require("uuid");
const axios = require("axios");

const config = require("../config.json");

module.exports = {

    createReference: async () => {
        return v4(Date.now);
    },
    getDonation: async (donation_id) => {
        const reqest = await axios.get(
            `https://api.mercadopago.com/v1/payments/${donation_id}`,
            {
                headers: {
                    Authorization: `Bearer ${config.payment.test}`,
                },
            }
        );

        return reqest.data;
    },
    createDonationURL: async (userId, reference, serverId, amount) => {
        const request = await axios.post(
            "https://api.mercadopago.com/checkout/preferences",
            {
                items: [
                    {
                        title: `Adquirir coins (${amount}) - [${userId}]`,
                        description: `${userId} pagou R$${amount} em WiseX LTDA`,
                        quantity: 1,
                        unit_price: amount,
                    },
                ],
                external_reference: reference,
               // marketplace: '405283998650507',
               // marketplace_fee: 0.50,
                capture: true,
                binary_mode: true,
                notification_url: `https://b261-138-97-182-129.ngrok.io/api/donations/callback`,
            },
            {
                headers: {
                    Authorization: `Bearer ${config.payment.test}`,
                },
            }
        );

        return request.data.sandbox_init_point; // sandbox_init_point
    },
};