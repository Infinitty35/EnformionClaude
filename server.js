const path = require('path');
const express = require('express');
const cors = require('cors');
const config = require('./src/config');
const searchRouter = require('./src/routes/search');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/search', searchRouter);

app.listen(config.port, () => {
  console.log(`Enformion search service listening on port ${config.port}`);
});
