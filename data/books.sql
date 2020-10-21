CREATE TABLE IF EXISTS books;

CREATE TABLE books(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn NUMERIC(13, 10),
  description TEXT,
  image_url TEXT
);

INSERT INTO books (author, title, description, isbn, image_url)
  VALUE('author', 'title', 'description', 'https://i.imgur.com/J5LVHEL.jpg', 9999123456)

INSERT INTO books (author, title, description, image_url, isbn)
  VALUE('Dune', 'Frank herbert', 'Follows the adventures of Paul Atreides, the son of a betrayed duke given up for dead on a treacherous planet and adopted by its fierce, nomadic people, who help him unravel his most unexpected destiny.', 'http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api', 'ISBN_13 9780441013593')
