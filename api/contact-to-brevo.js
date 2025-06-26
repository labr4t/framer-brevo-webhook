// api/contact-to-brevo.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const data = req.body;
  console.log("Incoming contact form data:", data);

  const contact = {
    email: data.email,
    attributes: {
      NAME: data.name,
      PHONE: data.phone,
      METHOD: data.method,
      MESSAGE: data.message,
      OFFER: data.offer === "on" ? "Yes" : "No",
    },
    listIds: [12], // ✅ Use different List ID if needed
    updateEnabled: true,
  };

  try {
    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    const brevoJson = await brevoRes.json();

    if (!brevoRes.ok) {
      return res
        .status(500)
        .json({ message: "Brevo Error", detail: brevoJson });
    }

    return res
      .status(200)
      .json({ message: "Contact saved to Brevo", detail: brevoJson });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
}
