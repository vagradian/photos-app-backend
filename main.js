const express = require('express');
const fs = require('fs');

const app = express();
const port = 3003;

app.get('/photos', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json(generatePhotoObjects());
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

function readDataFromFile(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.split('\n');
    const dataObject = {};

    lines.forEach(line => {
      const [key, values] = line.split(':');
      if (key && values) {
        dataObject[key.trim()] = values.split(',').map(value => value.trim());
      }
    });

    return dataObject;
  } catch (error) {
    console.error('Error reading data from file:', error.message);
    return {};
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomAvatar() {
  const avatarNumber = getRandomNumber(1, 6);
  return `img/avatar-${avatarNumber}.svg`;
}

function generateRandomAuthor(addedComments, authorNames) {
  let randomAuthor;

  do {
    randomAuthor = getRandomElement(authorNames);
  } while (addedComments.some(comment => comment.name === randomAuthor));

  return randomAuthor;
}

function generateRandomComment(addedComments, commentsOptions, authorNames) {
  let randomMessage;

  do {
    randomMessage = getRandomElement(commentsOptions);
  } while (addedComments.some(comment => comment.message === randomMessage));

  const randomAuthor = generateRandomAuthor(addedComments, authorNames);

  addedComments.push({ message: randomMessage, name: randomAuthor });

  return {
    id: getRandomNumber(1, 25),
    avatar: generateRandomAvatar(),
    message: randomMessage,
    name: randomAuthor,
  };
}

function generateRandomDescription(descriptions) {
  return getRandomElement(descriptions);
}

function generateComments(commentsOptions, authorNames) {
  const numComments = getRandomNumber(0, 9);
  const comments = [];

  for (let j = 0; j < numComments; j++) {
    generateRandomComment(comments, commentsOptions, authorNames);
  }

  return comments;
}

function generatePhotoObjects() {
  const data = readDataFromFile('./data.txt');
  const authorNames = data['authorNames'];
  const commentsOptions = data['commentsOptions'];
  const descriptions = data['descriptions'];

  const photoArray = [];

  for (let i = 1; i <= 25; i++) {
    const comments = generateComments(commentsOptions, authorNames);
    photoArray.push({
      id: i,
      url: `photos/${i}.jpg`,
      description: generateRandomDescription(descriptions),
      likes: getRandomNumber(15, 200),
      comments: comments,
    });
  }

  return photoArray;
}
