export const indexDisplay = (req, res) => {
  res.render("index");
};

export const display404 = (req, res) => {
  res.status(404).render("404");
};

export const display500 = (error, req, res, next) => {
  console.log(error);
  res.status(500).render("500");
};
