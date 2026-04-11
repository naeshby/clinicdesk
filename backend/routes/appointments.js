const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /api/appointments — create new appointment (also acts as lead capture)
router.post("/", async (req, res) => {
  const { name, phone, email, preferred_date, preferred_time, service_type } = req.body;

  if (!name || !phone || !email || !preferred_date || !preferred_time || !service_type) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert([{ name, phone, email, preferred_date, preferred_time, service_type, status: "Pending" }])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(500).json({ error: "Failed to save appointment.", details: error.message });
  }

  return res.status(201).json({ success: true, appointment: data });
});

// GET /api/appointments/export — CSV download (must be before /:id routes)
router.get("/export", async (req, res) => {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: "Failed to fetch appointments." });
  }

  const fields = ["id", "name", "phone", "email", "preferred_date", "preferred_time", "service_type", "status", "created_at"];
  const csvRows = [fields.join(",")];

  for (const row of data) {
    const values = fields.map((f) => {
      const val = row[f] ?? "";
      // Escape quotes and wrap in quotes if contains comma/newline
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    });
    csvRows.push(values.join(","));
  }

  const csv = csvRows.join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="leads-${Date.now()}.csv"`);
  return res.send(csv);
});

// GET /api/appointments — list all appointments
router.get("/", async (req, res) => {
  const { status } = req.query;

  let query = supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "All") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: "Failed to fetch appointments." });
  }

  return res.json({ appointments: data });
});

// PUT /api/appointments/:id — update status
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Pending", "Completed", "No-show"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: "Failed to update status.", details: error.message });
  }

  return res.json({ success: true, appointment: data });
});

// DELETE /api/appointments/:id — delete an appointment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: "Failed to delete appointment.", details: error.message });
  }

  return res.json({ success: true });
});

module.exports = router;
