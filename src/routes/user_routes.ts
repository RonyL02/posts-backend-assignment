import express from "express";
import { UserController } from "../controllers/user_controller";
const userController = new UserController();
const UserRouter = express.Router();

/**
* @swagger
* tags:
*   name: Users
*   description: The Users API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the comment
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         _id: 245234t234234r234r23f4
 *         username: johnny
 *         email: john@tk.com
 *         password: 324vt23r4tr234t245tbv45by
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */

UserRouter.get("/", userController.find.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a single comment by its ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

UserRouter.get("/:id", userController.findById.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               username:
 *                 type: string
 *                 description: The username of the user
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

UserRouter.put("/:id", userController.update.bind(userController));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user
 *     tags:
 *       - Users  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'      
 *           required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newId:
 *                   type: string
 *                   example: 45egdgd4546456gffhgf56r...
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

UserRouter.post("/", userController.create.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Delete a single user by its ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

UserRouter.delete("/:id", userController.delete.bind(userController));

export { UserRouter };
