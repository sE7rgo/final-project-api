const router = require("express").Router();

module.exports = db => {

  // getting all the parks
  router.get("/mybookings", (req,res) => {
    db.query(
      `
      SELECT *
      FROM pass_entries
      JOIN guests ON guests.entry_id = pass_entries.id
      JOIN pass_entries ON visitor_id = visitors(id)
    `
    )
    .then(result => {
        res.status(200).json({pass_entries: result.rows})
      })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  return router;
};