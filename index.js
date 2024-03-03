// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const app = express();

// Middleware для парсингу JSON тіл запитів
app.use(express.json());

app.get('/', (req, res) => {
  res.send("{id: 2, name: 'wdaergth', icon: 'fa-check-circle', editing: false}");
});

// POST запит, для створення даних
app.post('/', (req, res) => {
  // Тут ви обробляєте тіло запиту
  console.log(req.body); // req.body містить дані відправлені клієнтом
  res.status(201).send('Data created');
});

// PUT запит, для оновлення існуючих даних
app.put('/:id', (req, res) => {
  // req.params.id для отримання "id" з URL
  // req.body для отримання даних, які потрібно оновити
  console.log(`Updating data with id ${req.params.id}`, req.body);
  res.send(`Data with id ${req.params.id} updated`);
});

// DELETE запит, для видалення даних
app.delete('/:id', (req, res) => {
  // req.params.id для отримання "id" з URL
  console.log(`Deleting data with id ${req.params.id}`);
  res.send(`Data with id ${req.params.id} deleted`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});