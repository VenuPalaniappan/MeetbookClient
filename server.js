app.use(express.static(path.join(__dirname, "client", "dist")));
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});