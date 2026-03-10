const express = require("express");
const { body, param } = require("express-validator");
const {
    createPlacement,
    getPlacementsByCollege,
    deletePlacement,
} = require("../controllers/placementController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Create Placement */
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    [
        body("collegeId")
            .isInt()
            .withMessage("College ID must be an integer")
            .notEmpty()
            .withMessage("College ID is required"),

        body("year")
            .isInt({ min: 2000, max: new Date().getFullYear() })
            .withMessage(`Year must be between 2000 and ${new Date().getFullYear()}`),

        body("highestPackage")
            .optional()
            .isString()
            .withMessage("Highest package must be a string"),

        body("averagePackage")
            .optional()
            .isString()
            .withMessage("Average package must be a string"),

        body("placementRate")
            .optional()
            .isString()
            .withMessage("Placement rate must be a string"),

        body("totalPlaced")
            .optional()
            .isInt({ min: 0 })
            .withMessage("Total placed must be a positive integer"),
    ],
    createPlacement
);

/** Get Placements by College */
router.get(
    "/college/:collegeId",
    loggerMiddleware,
    [
        param("collegeId")
            .isInt()
            .withMessage("College ID must be an integer")
            .notEmpty()
            .withMessage("College ID is required"),
    ],
    getPlacementsByCollege
);

/** Delete Placement */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [
        param("id")
            .isInt()
            .withMessage("Placement ID must be an integer")
            .notEmpty()
            .withMessage("Placement ID is required"),
    ],
    deletePlacement
);

module.exports = router;
