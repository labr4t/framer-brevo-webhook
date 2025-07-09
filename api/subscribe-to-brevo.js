// api/subscribe-to-brevo.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const data = req.body;
  console.log("Incoming subscribe form data:", data);

  const contact = {
    email: data.email,
    attributes: {
      AGREE: data.agree === "on" ? "Yes" : "No",
      DATE: data.date, // ✅ Add this!
    },
    listIds: [11], // ✅ You can use a different list ID if needed
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
      .json({ message: "Subscriber added to Brevo", detail: brevoJson });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
}
