const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const PARTICIPANTS_FILE = path.join(__dirname, 'participants.txt');

app.use(cors());
app.use(express.json());

if (!fs.existsSync(PARTICIPANTS_FILE)) {
  fs.writeFileSync(PARTICIPANTS_FILE, '');
}

// POST /register — Non-blocking async file append (event-driven architecture)
app.post('/register', (req, res) => {
  const { name, department } = req.body;

  if (!name || !department) {
    return res.status(400).json({ error: 'Name and department are required.' });
  }

  const timestamp = new Date().toISOString();
  const entry = `Name: ${name} | Department: ${department} | Registered At: ${timestamp}\n`;

  // fs.appendFile is non-blocking — other requests continue processing
  // while this I/O operation is pending (Node.js event loop advantage)
  fs.appendFile(PARTICIPANTS_FILE, entry, (err) => {
    if (err) {
      console.error('File write error:', err);
      return res.status(500).json({ error: 'Failed to save registration.' });
    }
    console.log(`[${timestamp}] Registered: ${name} | ${department}`);
    res.status(201).json({
      success: true,
      message: `${name} successfully registered!`,
      participant: { name, department, timestamp },
    });
  });
});

// GET /participants — Returns all registered participants
app.get('/participants', (req, res) => {
  fs.readFile(PARTICIPANTS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read participants.' });
    }

    if (!data.trim()) {
      return res.json({ participants: [], total: 0 });
    }

    const participants = data
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line, index) => {
        const nameMatch = line.match(/Name:\s*(.+?)\s*\|/);
        const deptMatch = line.match(/Department:\s*(.+?)\s*\|/);
        const timeMatch = line.match(/Registered At:\s*(.+)/);
        return {
          id: index + 1,
          name: nameMatch ? nameMatch[1] : 'Unknown',
          department: deptMatch ? deptMatch[1] : 'Unknown',
          timestamp: timeMatch ? timeMatch[1] : '',
        };
      });

    res.json({ participants, total: participants.length });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Workshop Server running at http://0.0.0.0:${PORT}`);
  console.log(`   POST /register     → Register a student`);
  console.log(`   GET  /participants → List all participants\n`);
});