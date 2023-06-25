const db = require('../db')
const { hash } = require('bcryptjs')
const { sign, JsonWebTokenError } = require('jsonwebtoken')
const { SECRET } = require('../constants')

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query('select user_id, email, password from users')
    return res.status(200).json({
      success: true,
      users: rows,
    })

  } catch (error) {
    console.log(error.message)
  }
}


exports.register = async (req, res) => {
  const { email, password } = req.body
  try {
    const hashedPassword = await hash(password, 10)
    console.log(password, "heslo")
    await db.query('insert into users(email,password) values ($1 , $2)', [
      email,
      hashedPassword,
    ])
    console.log(email);
    return res.status(201).json(
      {
      success: true,
      message: 'The registration was succesfull',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}
/*
exports.files = async (req, res, user_id, file_id) => {
  const { filename, content } = req.body;
  try {
    await db.query(
      'INSERT INTO files (file_id, filename, content) VALUES ($1, $2, $3)',
      [file_id, filename, content]
    );

    await db.query(
      'INSERT INTO userFile (user_id, file_id, role) VALUES ($1, $2, $3)',
      [user_id, file_id, 'write']
    );

    console.log("OK");
    return res.status(201).json({
      success: true,
      message: 'Saving was successful',
    });
  } catch (error) {
    console.log("zle");
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
*/

exports.files = async (req, res) => {
  const { filename , content } = req.body
  const token = req.cookie;
  console.log("token je: ", token)
  try {
    console.log("user_id:", user_id); // Log the user_id
    const file_id_seq = await db.query(
      "SELECT nextval('public.files_file_id_seq')"
    );
    const next_file_id = file_id_seq.rows[0].nextval;
    
  await db.query('insert into files(file_id, filename , content ) values ($1 , $2, $3)', [
    next_file_id,
      filename,
      content,
  ])
  await db.query(
    'INSERT INTO userFile (user_id, file_id, role) VALUES ($1, $2, $3)',
    [user_id, next_file_id, 'owner']
  );
//   INSERT INTO files (filename, content)
// VALUES ('test_file1.txt', 'Sample content 1'),
//        ('test_file2.txt', 'Sample content 2'),
//        ('test_file3.txt', 'Sample content 3');
  console.log("OK-zapisane do oboch");
    return res.status(201).json(
      {
      success: true,
      message: 'Saving was succesfull',
    })
  } catch (error) {
    console.log("zle")
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.getFiles = async (req, res) => {
  try {
    const { rows } = await db.query('select file_id, filename from files')
    return res.status(200).json({
      success: true,
      files: rows,
    })

  } catch (error) {
    console.log(error.message)
  }
}


exports.login = async (req, res) => {
  let user = req.user
  let payload = {
    id: user.user_id,
    email: user.email,
  }

  try {
    const token = await sign(payload, SECRET)

    return res.status(200).cookie('token', token, { httpOnly: true }).json({
      success: true,
      message: 'Logged in succefully',
      user_id: user.user_id,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.getCurrentUserId = () => {
  return currentUserId;
};

exports.protected = async (req, res) => {
  try {
    return res.status(200).json({
      info: 'protected info',
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie('token', { httpOnly: true }).json({
      success: true,
      message: 'Logged out succefully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}
