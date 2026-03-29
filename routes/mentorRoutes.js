const express = require("express");
const { body, param, query } = require("express-validator");

const {
    createMentor,
    getAllMentors,
    getMentorById,
    updateMentor,
    deleteMentor,
} = require("../controllers/mentorController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** CREATE */
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    [
        body("name").isString().notEmpty(),
        body("profileImage").optional().isString(),
        body("title").optional().isString(),
        body("role").optional().isString(),
        body("rating").optional().isFloat(),
        body("totalReviews").optional().isInt(),
        body("experienceYears").optional().isInt(),
        body("studentsGuided").optional().isInt(),
    ],
    createMentor
);

/** GET ALL */
router.get(
    "/all",
    loggerMiddleware,
    [
        query("page").optional().isInt(),
        query("limit").optional().isInt(),
        query("search").optional().isString(),
    ],
    getAllMentors
);

/** GET SINGLE */
router.get(
    "/:id",
    loggerMiddleware,
    [param("id").isInt()],
    getMentorById
);

/** UPDATE */
router.put(
    "/update/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isInt()],
    updateMentor
);

/** DELETE */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isInt()],
    deleteMentor
);

module.exports = router;