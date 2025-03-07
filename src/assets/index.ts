// Image imports
import db1Image from '/assets/db1.png';
import db2Image from '/assets/db2.png';
import db3Image from '/assets/db3.png';
import db4Image from '/assets/db4.png';

export const images = {
  db1: db1Image,
  db2: db2Image,
  db3: db3Image,
  db4: db4Image
};

export const getImageUrl = (name: string) => {
  switch (name) {
    case 'db1.png':
      return db1Image;
    case 'db2.png':
      return db2Image;
    case 'db3.png':
      return db3Image;
    case 'db4.png':
      return db4Image;
    default:
      return null;
  }
};