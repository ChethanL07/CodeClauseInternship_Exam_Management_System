const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',         // PostgreSQL user
  host: 'localhost',        // PostgreSQL host
  database: 'exam-management',  // PostgreSQL database name
  password: 'post',         // PostgreSQL password
  port: 5432,               // PostgreSQL port
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'infoexam2228@gmail.com', // replace with your email
    pass: 'dnfz ukxw rwko isje',  // replace with your email password
  },
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password, role, regno, class: studentClass } = req.body;

  try {
    if (role === 'admin') {
      await pool.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [name, email, password, role]);
    } else if (role === 'student') {
      await pool.query('INSERT INTO users (name, email, password, role, regno, class) VALUES ($1, $2, $3, $4, $5, $6)', [name, email, password, role, regno, studentClass]);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ success: false, message: 'An error occurred during registration' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT role FROM users WHERE email = $1 AND password = $2', [email, password]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ success: true, role: user.role });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ success: false, message: 'An error occurred during login' });
  }
});

// Add new endpoint for creating an examination
app.post('/api/examinations', async (req, res) => {
  const { examName, examDate } = req.body;

  try {
    await pool.query('INSERT INTO examinations (exam_name, exam_date) VALUES ($1, $2)', [examName, examDate]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ success: false, message: 'An error occurred while creating examination' });
  }
});

// Add new endpoint for fetching examinations
app.get('/api/examinations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM examinations');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ success: false, message: 'An error occurred while fetching examinations' });
  }
});

// Add new endpoint for submitting examination form
app.post('/api/examination-form', async (req, res) => {
  const { name, class: studentClass, regno, gender, phno, email, address, registeredCourse, comment, answers = '' } = req.body;

  try {
    console.log('Form data received:', req.body);
    await pool.query(
      'INSERT INTO examination_forms (name, class, regno, gender, phno, email, address, registered_course, comment, answers) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [name, studentClass, regno, gender, phno, email, address, registeredCourse, comment, answers]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ success: false, message: 'An error occurred while submitting the form' });
  }
});

// Add new endpoint for fetching examination forms
app.get('/api/examination-forms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM examination_forms');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ success: false, message: 'An error occurred while fetching examination forms' });
  }
});

// Add new endpoint for accepting an examination form
app.post('/api/accept-form', async (req, res) => {
  const { formId } = req.body;

  try {
    const result = await pool.query('UPDATE examination_forms SET status = $1 WHERE id = $2 RETURNING email', ['accepted', formId]);
    if (result.rows.length > 0) {
      const email = result.rows[0].email;

      // Send notification email
      const mailOptions = {
        from: 'infoexam2228@gmail.com', // replace with your email
        to: email,
        subject: 'Examination Form Accepted',
        text: 'Your examination form has been accepted. You can now download your hall ticket.',
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });

      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Form not found' });
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ success: false, message: 'An error occurred while accepting the form' });
  }
});

// Endpoint to get the form status for a student
app.get('/api/form-status/:regno', async (req, res) => {
  const { regno } = req.params;

  try {
    const result = await pool.query('SELECT status FROM examination_forms WHERE regno = $1', [regno]);
    if (result.rows.length > 0) {
      res.json({ status: result.rows[0].status });
    } else {
      res.status(404).json({ message: 'Form not found' });
    }
  } catch (error) {
    console.error('Error fetching form status', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching the form status' });
  }
});

// Endpoint to create a student group
app.post('/api/student-group', async (req, res) => {
  const { examId, groupName, students } = req.body; // students should be an array of student IDs

  if (!examId || !groupName || !students || !Array.isArray(students) || students.length === 0) {
    return res.status(400).send({ error: 'Please provide all required fields and ensure students is a non-empty array' });
  }

  try {
    // Check if group already exists for the given examId and groupName
    const existingGroup = await pool.query('SELECT id FROM student_groups WHERE exam_id = $1 AND group_name = $2', [examId, groupName]);
    let groupId;

    if (existingGroup.rows.length > 0) {
      // Use the existing group ID
      groupId = existingGroup.rows[0].id;
    } else {
      // Create a new group and get the new group ID
      const groupResult = await pool.query('INSERT INTO student_groups (exam_id, group_name) VALUES ($1, $2) RETURNING id', [examId, groupName]);
      groupId = groupResult.rows[0].id;
    }

    // Insert each student into group_students table, avoiding duplicates
    const insertPromises = students.map(studentId => {
      return pool.query('INSERT INTO group_students (group_id, student_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM group_students WHERE group_id = $1 AND student_id = $2)', [groupId, studentId]);
    });
    await Promise.all(insertPromises);

    res.status(201).send({ success: true });
  } catch (error) {
    console.error('Error creating student group', error.stack);
    if (error.code === '23503') {
      // Foreign key violation
      return res.status(400).send({ error: 'Invalid group or student ID' });
    }
    res.status(500).send({ error: 'Error creating student group' });
  }
});

// Endpoint to fetch all student groups along with student details
app.get('/api/student-groups', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.id as group_id, g.group_name, s.id as student_id, s.name, s.regno
      FROM student_groups g
      JOIN group_students gs ON g.id = gs.group_id
      JOIN users s ON gs.student_id = s.id
    `);

    // Transform the result into a grouped format
    const groupedData = result.rows.reduce((acc, row) => {
      const { group_id, group_name, student_id, name, regno } = row;
      if (!acc[group_id]) {
        acc[group_id] = { id: group_id, group_name, students: [] };
      }
      acc[group_id].students.push({ id: student_id, name, regno });
      return acc;
    }, {});

    res.json(Object.values(groupedData));
  } catch (error) {
    console.error('Error fetching student groups', error.stack);
    res.status(500).json({ success: false, message: 'An error occurred while fetching student groups' });
  }
});

// Endpoint to fetch all students
app.get('/api/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE role = $1', ['student']);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students', error.stack);
    res.status(500).json({ success: false, message: 'An error occurred while fetching students' });
  }
});

// Fetch Form Status
app.get('/api/form-status/:regno', async (req, res) => {
  const { regno } = req.params;

  try {
    const result = await pool.query('SELECT status FROM examination_forms WHERE regno = $1', [regno]);
    if (result.rows.length > 0) {
      res.status(200).json({ status: result.rows[0].status });
    } else {
      res.status(404).json({ status: 'not found' });
    }
  } catch (error) {
    console.error('Error fetching form status:', error);
    res.status(500).json({ success: false, message: 'Error fetching form status' });
  }
});
// Endpoint to fetch all student groups along with student details and exam info
app.get('/api/student-groups', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.id as group_id, g.group_name, e.exam_name, s.id as student_id, s.name, s.regno
      FROM student_groups g
      JOIN examinations e ON g.exam_id = e.id
      JOIN group_students gs ON g.id = gs.group_id
      JOIN users s ON gs.student_id = s.id
    `);

    // Transform the result into a grouped format
    const groupedData = result.rows.reduce((acc, row) => {
      const { group_id, group_name, exam_name, student_id, name, regno } = row;
      if (!acc[group_id]) {
        acc[group_id] = { id: group_id, group_name, exam_name, students: [] };
      }
      acc[group_id].students.push({ id: student_id, name, regno });
      return acc;
    }, {});

    res.json(Object.values(groupedData));
  } catch (error) {
    console.error('Error fetching student groups', error.stack);
    res.status(500).json({ success: false, message: 'An error occurred while fetching student groups' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
