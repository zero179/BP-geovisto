const { Router } = require('express')
const {
  getUsers,
  register,
  login,
  protected,
  logout,
  files,
  getFiles,
} = require('../controllers/auth')
const {
  validationMiddleware,
} = require('../middlewares/validations-middleware')
const { registerValidation, loginValidation } = require('../validators/auth')
const { userAuth } = require('../middlewares/auth-middleware')
const router = Router()
const db = require('../db')

//vytvorit 

router.get('/get-users', getUsers)
router.get('/get-users/files', getFiles)
router.get('/protected', userAuth, protected)
router.post('/register', registerValidation, validationMiddleware, register)
router.post('/files', files)
router.post('/login', loginValidation, validationMiddleware, login)
router.get('/logout', logout)
router.get('/get-users/:id', async (req, res) => {
  try{
    const {id} = req.params;
    const users_rows = await db.query("SELECT * from users WHERE user_id = $1", [id])
    res.json(users_rows['rows'][0]);
  }catch(err){
    console.error(err.message);
  }
})

router.get('/get-users/:id/files/', async (req, res) => {
  try{
    const {id} = req.params;
    const files_rows = await db.query("SELECT * from files INNER JOIN userFile on files.file_id = userFile.file_id WHERE userFile.user_id = $1", [id])
    res.json(files_rows['rows'][0]);
  }catch(err){
    console.error(err.message);
  }
})

router.get('/get-users/files/:id', async (req, res) => {
  try{
    const {id} = req.params;
    const files_rows = await db.query("SELECT * from files WHERE file_id = $1", [id])
    res.json(files_rows['rows'][0]);
  }catch(err){
    console.error(err.message);
  }
})

router.get('/get-users/files/add-user', async (req, res) => {
  try {
    const { email } = req.body; // assuming email is passed in the request body
    const { rows } = await db.query("SELECT user_id FROM users WHERE email = $1", [email]);
    return res.status(200).json({
      success: true,
      files: rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post('/get-users/files/add-user', async (req, res) => {
  try {
    const { email } = req.body; // assuming email is passed in the request body
    const { rows } = await db.query('SELECT user_id FROM users WHERE email = $1', [
      email,
    ]);
    const user_id = rows[0]?.user_id; // Extract user_id from the query result
    return res.status(200).json({
      success: true,
      user_id: user_id, // Send the user_id in the response
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post('/get-users/files/add-user-file', async (req, res) => {
  try {
    const { user_id, file_id, role } = req.body;
    // Insert the user_id, file_id, and role into the userFile table
    await db.query(
      'INSERT INTO userFile (user_id, file_id, role) VALUES ($1, $2, $3)',
      [user_id, file_id, role]
    );

    return res.status(200).json({
      success: true,
      message: 'User file added successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.delete("/get-users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await db.query("DELETE FROM users WHERE user_id = $1", [
      id
    ]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

router.delete("/get-users/files/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFile = await db.query("DELETE FROM files WHERE file_id = $1", [
      id
    ]);
    res.json("File was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

router.put('/get-users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const {password} = req.body;
    const updateUser = await db.query(
      "UPDATE users SET email = $1, password = $2 WHERE user_id = $3",
      [email,password, id]
    );

    res.json("User was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

router.put('/get-users/files/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { filename } = req.body;
    const updateFile = await db.query(
      "UPDATE files SET filename = $1 WHERE file_id = $2",
      [filename, id]
    );

    res.json("File was updated!");
  } catch (err) {
    console.error(err.message);
  }
});
//router.get('get-users/id/delete', deleteUser)

module.exports = router
