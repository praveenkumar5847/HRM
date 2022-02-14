//router level middleware
const { Router } = require("express");
const multer = require("multer");
const router = Router();
const EMPLOYEE = require("../Model/Employee");
const { ensureAuthenticated } = require("../helper/auth_helper");

// load multer middlewar
let { storage } = require("../middlewares/multer");
const upload = multer({ storage: storage });
/*@HTTP GET METHOD
    @ACCESS PUBLIC
    @URL employee/home
 */
router.get("/home", async (req, res) => {
  let details = await EMPLOYEE.find({}).lean();

  res.render("../views/home", { title: "Home page", details });
});
/*@HTTP GET METres.render("../views/home");HOD
    @ACCESS PUBLIC
    @URL employee/create-emp
 */
router.get("/create-emp", async (req, res) => {
  res.render("../views/employees/create-emp", { title: "create employee" });
});

/*=====================END OF ALL GET METHODS===========================*/

/*@HTTP POST METHOD
    @ACCESS PRIVATE
    @URL employee/create-emp
 */

router.get("/:id", async (req, res) => {
  let payload = await EMPLOYEE.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/employeeprofile", { payload });
  console.log(payload);
});

router.get("/edit-emp/:id", ensureAuthenticated, async (req, res) => {
  let editPayload = await EMPLOYEE.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/editEmp", { editPayload });
});

router.post(
  "/create-emp",

  upload.single("emp_photo"),
  async (req, res) => {
    let payload = {
      emp_photo: req.file,
      emp_name: req.body.emp_name,
      emp_id: req.body.emp_id,
      emp_salary: req.body.emp_salary,
      emp_edu: req.body.emp_edu,
      emp_gender: req.body.emp_gender,
      emp_perc: req.body.emp_perc,
      emp_loc: req.body.emp_loc,
      emp_exp: req.body.emp_exp,
      emp_skills: req.body.emp_skills,
      emp_phn: req.body.emp_phn,
      emp_mail: req.body.emp_mail,
    };
    // await EMPLOYEE.create(payload);
    await new EMPLOYEE(payload).save();
    req.flash("SUCCESS_MESSAGE", "PROFILE created SUCCESSFULLY");
    res.redirect("/employee/home", 302, {});
  }
);

router.put("/edit-emp/:id", upload.single("emp_photo"), (req, res) => {
  EMPLOYEE.findOne({ _id: req.params.id })
    .then((edit) => {
      // old new
      (edit.emp_photo = req.file),
        (edit.emp_id = req.body.emp_id),
        (edit.emp_name = req.body.emp_name),
        (edit.emp_gender = req.body.emp_gender),
        (edit.emp_perc = req.body.emp_perc),
        (edit.emp_skills = req.body.emp_skills),
        (edit.emp_loc = req.body.emp_loc),
        (edit.emp_phn = req.body.emp_phn),
        (edit.emp_mail = req.body.emp_mail),
        (edit.emp_exp = req.body.emp_exp),
        (edit.emp_salary = req.body.emp_salary),
        (edit.emp_edu = req.body.emp_edu);
      //Update data in db
      edit.save().then((_) => {
        req.flash("SUCCESS_MESSAGE", "PROFILE EDITED SUCCESSFULLY");
        res.redirect("/employee/home", 302, {});
      });
    })
    .catch((err) => {
      if (err) return req.flash("ERROR_MESSAGE", "PROFILE EDIT failed");
    });
});
router.delete("/delete-emp/:id", async (req, res) => {
  await EMPLOYEE.deleteOne({ _id: req.params.id });
  req.flash("SUCCESS_MESSAGE", "PROFILE deleted SUCCESSFULLY");
  res.redirect("/employee/home", 302, {});
});

module.exports = router;
