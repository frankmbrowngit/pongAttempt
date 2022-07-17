const express = require('express');
const app = express();
const PORT = 3001 || process.env.PORT;
const path = require('path');
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (_req,res) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
});

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
})