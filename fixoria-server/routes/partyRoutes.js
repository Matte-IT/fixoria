const router = require("express").Router();

const { createParty } = require("../controllers/party/createParty");
const { getAllParties } = require("../controllers/party/getAllParties");
const { getAParty } = require("../controllers/party/getAParty");
const { updateAParty } = require("../controllers/party/updateAParty");
const { deleteAParty } = require("../controllers/party/deleteAParty");

router
  .post("/", createParty) // POST to create a party
  .get("/", getAllParties) // GET to fetch all parties
  .get("/:id", getAParty) // GET to fetch A party by id
  .patch("/:id", deleteAParty) // DELETE A party by id
  .put("/:id", updateAParty); // PUT to update a specific party by id

module.exports = router;
