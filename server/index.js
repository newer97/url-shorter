const express = require("express");
const app = express();
const { nanoid } = require("nanoid");
const db = require("./database");
const yup = require("yup");
require("dotenv").config();
const port = process.env.PORT;
const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/^[\w\-]+$/i),
  url: yup.string().trim().url().required(),
});

app.use(express.json());
app.listen(port);
app.use(express.static("public"));

app.get("/:id", async (req, res, next) => {
  const slug = req.params["id"];
  const url = await db.geturl(slug);
  if (url === false)
    next({
      message: "Not found",
    });
  else res.redirect(302, url);
});

app.post("/url", async (req, res, next) => {
  let { slug, url } = req.body;
  try {
    await schema.validate({
      slug,
      url,
    });
    if (!slug) {
      slug = nanoid();
    }
    const exising = await db.exsisting(slug);
    if (exising) {
      throw new Error("Slug in use");
    }
    slug = slug.toLowerCase();
    const created = await db.addurl(url, slug);
    res.json(created);
  } catch (e) {
    next(e);
  }
});
app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
  });
});
