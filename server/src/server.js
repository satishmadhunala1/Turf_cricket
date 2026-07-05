require('./config/env');
const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');

connectDB();

app.listen(port, () => {
  console.log(`🚀 TurfBook API running on port ${port}`);
});
