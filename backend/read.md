app.post("/auth/login", (req, res) => {
  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: "Вася Пупа",
    },
    "secret123"
  ); //передаёи информацию для шифрования

  res.json({
    success: true,
    token,
  });
});