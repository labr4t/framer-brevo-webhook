export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const data = req.body;

  const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY, // Secret is pulled from env
    },
    body: JSON.stringify({
      email: data.email,
      attributes: {
        NAME: data.name,
        PHONE: data.phone,
        DEPARTURE: data.departure,
        BUDGET: data.budget,
        METHOD: data.method,
        MESSAGE: data.message,
        TITLE: data.title,
      },
      listIds: [10],
      updateEnabled: true,
    }),
  });

  const result = await brevoResponse.json();

  if (!brevoResponse.ok) {
    return res.status(500).json({ message: "Brevo Error", detail: result });
  }

  res.status(200).json({ message: "Contact sent to Brevo", detail: result });
}
cd