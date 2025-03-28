const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
 const PORT = 5500 ;


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'umer@$2004',
  database: 'real_estate'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database.');
  }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use('/umer_folder', express.static(path.join(__dirname, 'umer_folder')));

// Serve the login form

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'umer_folder/html_files/tenant_login.html'));
// });

// Server the Create account form

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'umer_folder/html_files/landlord_signup.html'));
});

// Login for tenant

app.post('/login', (req, res) => {
    const { tenant_id, password_n } = req.body;
  
    if (!tenant_id || !password_n) {
      return res.status(400).json({ message: 'Both name and age are required.' });
    }
  
    const query = 'SELECT tenant_id, password_v FROM tenant WHERE tenant_id = ?';
    db.query(query, [tenant_id], (err, results) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ message: 'Error logging in.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const user = results[0];
      if (password_n!=user.password_v) {
        return res.status(401).json({ message: 'Invalid password.' });
      }
  
      const userId = user.tenant_id;
      res.redirect(`/dashboard?userId=${userId}`); 
    });
  });

// Create account for tenant

app.post('/submit_n', (req, res) => {
    const { first_name,last_name,cnic_no,contact_no,password_v } = req.body;
  
    const query = 'INSERT INTO tenant(first_name,last_name,cnic_no,contact_no,password_v) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [first_name,last_name,cnic_no,contact_no,password_v], (err, results) => {
      if (err) {
        console.error('Error in inserting user:', err);
        return res.status(500).json({ message: 'Error siginging in.' });
      }
  
      const userId = results.insertId;
      res.redirect(`/dashboard?userId=${userId}`); 
    });
  });


  app.get('/dashboard', (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).send('User ID is required.');
    }
    res.sendFile(path.join(__dirname, 'umer_folder/html_files/tenant_display.html'));
  });


  app.get('/profile', (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).send('User ID is required.');
    }
    res.sendFile(path.join(__dirname, 'umer_folder/html_files/tenant_profile.html'));
  });


  app.get('/advertisements', (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).send('User ID is required.');
    }
    res.sendFile(path.join(__dirname, 'umer_folder/html_files/tenant_advertise.html'));
  });


  // *************************** Tenant Profile ******************************8

// Fetch Tenant Profile

app.get('/profile/:userId', (req, res) => {
    const tenant_id = req.params.userId;
  
    const profileQuery = `
      Select tenant_id, first_name,last_name,cnic_no,contact_no from tenant where tenant_id = ?
    `;
  
    db.query(profileQuery, [tenant_id], (err, results) => {
      if (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json({ message: 'Failed to fetch profile.' });
      }
      res.json(results[0]);
    });
  });
  
  // Update Landlord profile
  
  app.put('/profile/:userId', (req, res) => {
    const tenant_id = req.params.userId;
    const { first_name, last_name, cnic_no, contact_no } = req.body;
  
    const updateQuery = `
      UPDATE tenant
      SET first_name = ?, last_name = ?, cnic_no = ?, contact_no = ?
      WHERE tenant_id = ?;
    `;
  
    db.query(updateQuery, [first_name, last_name, cnic_no, contact_no, tenant_id], (err) => {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ message: 'Failed to update profile.' });
      }
      res.json({ message: 'Profile updated successfully!' });
    });
  });



  // ********************* Advertisments Display *************************

  // Fetch the properties that were advertised

  app.get('/advertisements/:userId', (req, res) => {
    const tenant_id = req.params.userId;
    const query = `
      Select p.property_id, p.address, p.size, a.demanded_rent, d.first_name from
      advertising a join property p on
      a.Property_property_id = p.property_id join landlord d on
      p.Landlord_landlord_id = d.landlord_id order by p.property_id asc `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching advertisements:', err);
        return res.status(500).json({ message: 'Failed to fetch advertisements.' });
      }
      res.json(results);
    });
  });

  

  // Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });